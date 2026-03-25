# さんすうダンジョン — 引き継ぎドキュメント

## 次のタスク: PixiJS + Tiny Swords アセット導入

### やること

1. **Tiny Swords アセットをプロジェクトに配置**
   - `C:\Users\iioka\Downloads\Tiny Swords (Free Pack).zip` を展開
   - 中身を `public/assets/tiny-swords/` に配置
   - Git に追加・コミット

2. **PixiJS を導入**
   ```bash
   npm install pixi.js
   ```

3. **VillageCanvas を PixiJS ベースに書き換え**
   - 現在: `src/components/VillageCanvas.tsx` (Canvas 2D, アイソメトリック手描き)
   - 目標: PixiJS の `Application` + `Sprite` + `AnimatedSprite` で描画
   - Tiny Swords のスプライトシートを読み込んで建物・キャラ・地形を表示
   - 既存のアイソメトリック座標変換 (`isoXY`, `screenToGrid`) はそのまま流用可能

### アーキテクチャ概要

```
src/
├── App.tsx                     # シーンルーター (title/base/worldmap/dungeon/result)
├── pages/
│   ├── TitlePage.tsx           # 学年選択
│   ├── BasePage.tsx            # 拠点ページ (村ビジュアル + ショップ/もちもの/建築パネル)
│   ├── WorldMapPage.tsx        # フロア選択 + 難易度切替
│   ├── DungeonPage.tsx         # ダンジョン探索 + バトル
│   └── ResultPage.tsx          # クリア/ゲームオーバー
├── components/
│   ├── VillageCanvas.tsx       # ★PixiJS化対象★ アイソメトリック村 (Canvas2D)
│   ├── ClockFace.tsx           # SVG時計 (floor106の問題用)
│   ├── DungeonCanvas.tsx       # ダンジョン描画 (Canvas2D, そのまま)
│   ├── BattleOverlay.tsx       # バトルUI
│   ├── QuestionPanel.tsx       # 問題表示 (clockTime対応済み)
│   ├── PlayerHud.tsx / HpBar / ExpBar / DPad / etc.
│   └── MonsterSprite.tsx / DamageNumber.tsx
├── hooks/
│   ├── useGameState.ts         # 全体状態管理 (scene, player, inventory, buildings)
│   ├── useBattle.ts            # バトルロジック (難易度スケーリング対応済み)
│   ├── useDungeon.ts           # ダンジョン探索ロジック
│   ├── useInput.ts             # キーボード/タッチ入力
│   └── useTimer.ts             # バトルタイマー
├── lib/
│   ├── battleEngine.ts         # ダメージ/EXP/ゴールド計算
│   ├── gameEngine.ts           # タイル移動/衝突/カメラ
│   └── storage.ts              # localStorage セーブ/ロード
├── data/
│   ├── types.ts                # 全型定義 (★BuildingDef, clockTime含む)
│   ├── buildings.ts            # 建物定義 (8棟, gridX/gridY座標)
│   ├── items.ts                # アイテム定義 (5種)
│   ├── floors.ts               # フロア定義 (18フロア)
│   ├── monsters.ts             # モンスター定義 (74体)
│   ├── maps/                   # ASCIIタイルマップ (18枚)
│   └── questions/              # 問題データ (270問, floor106は時計画像付き)
└── styles/
    ├── variables.css            # パステル系カラーパレット
    └── animations.css           # キーフレームアニメーション
```

### ゲームフロー

```
タイトル → 拠点(村) → ワールドマップ → ダンジョン → バトル → リザルト → 拠点(村)
  │           │            │                                         │
  │           ├─ 泉: HP回復  ├─ 難易度切替                             │
  │           ├─ ショップ    ├─ 全フロア解放済                          │
  │           ├─ もちもの    └─ フロア選択                             │
  │           └─ 建築                                                │
  └─学年選択(小1/小4)                                                └─(戻る)
```

### 状態管理

- **GameState** (useGameState.ts): scene, grade, gameDifficulty, player, clearedFloors, inventory, buildings
- **SaveData** (storage.ts): localStorage に自動保存, 小1/小4で別セーブ
- **後方互換**: 新フィールド (gold, inventory, buildings) はマージ時にデフォルト値適用

### 建物システム

| ID | 名前 | コスト | 位置(gx,gy) | 効果 |
|---|---|---|---|---|
| fountain | いやしの泉 | 0 | 3,3 | HP全回復 |
| shop | ショップ | 0 | 1,2 | アイテム購入 |
| guild | ぼうけんギルド | 0 | 4,1 | ダンジョンへ |
| dojo | たいりょくどうじょう | 120 | 1,4 | HP上限+20 |
| library | まほうとしょかん | 150 | 4,4 | ATK+5 |
| inn | やどや | 200 | 2,1 | 装飾 |
| tower | ものみのとう | 300 | 3,1 | 装飾 |
| garden | おはなばたけ | 80 | 3,4 | 装飾 |

### VillageCanvas PixiJS化のポイント

1. **React + PixiJS統合**: useEffect内で `new PIXI.Application()` を作成、canvasをcontainerにappend
2. **スプライトシート**: Tiny Swordsのスプライトシートを `PIXI.Spritesheet` で読み込み
3. **アイソメトリック座標**: 既存の `isoXY()` 関数をそのまま使ってスプライト位置を計算
4. **奥行きソート**: `container.sortableChildren = true` + `sprite.zIndex = isoY` で自動ソート
5. **NPC歩行アニメ**: `PIXI.AnimatedSprite` でTiny Swordsのキャラスプライトをアニメーション
6. **パーティクル**: `@pixi/particle-emitter` で煙・水しぶき・きらきらを表現
7. **クリック判定**: `sprite.interactive = true` + `sprite.on('pointerdown', ...)` で建物タップ検知
8. **cleanup**: useEffectのreturnで `app.destroy(true)` を呼ぶ

### Tiny Swords アセット構成 (想定)

```
public/assets/tiny-swords/
├── Terrain/          # 地形タイル (芝生, 道, 水)
├── Buildings/        # 建物スプライト
├── Factions/         # キャラクター (歩行アニメ付き)
├── Deco/             # 装飾 (木, 花, 岩)
└── Resources/        # その他リソース
```

### 難易度システム

- **ふつう**: タイマー15秒, モンスターそのまま
- **むずかしい**: タイマー10秒, モンスターHP/ATK/EXP x1.5
- ワールドマップでトグル切替, セーブに保存しない(ランタイムのみ)

### 時計問題 (floor106)

- `Question.clockTime?: { hour: number; minute: number }` が存在する場合、QuestionPanelがClockFace SVGを表示
- ClockFace: 時針・分針をSVGで動的描画
- 15問: easy(ちょうどの時間), normal(30分/15分), hard(任意の時刻+文章題)

### ビルド・lint

```bash
npm install
npx tsc -b          # 型チェック (0エラー)
npx eslint src/     # lint (0エラー)
npx vite build      # ビルド (~299KB JS)
npm run dev         # 開発サーバー
```

### ブランチ

- `main`: 本番 (PRマージ済み)
- `claude/sansu-implementation-6T5Cc`: 作業ブランチ (main にマージ済み + 最新コミットあり)

### 既知の課題

- VillageCanvasのウィンドウリサイズ未対応 (PixiJS化時に `app.resizeTo` で解決)
- gameDifficulty がセーブに永続化されていない (ランタイムのみ、意図的)
