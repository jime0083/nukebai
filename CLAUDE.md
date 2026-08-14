# ヌケバイ プロジェクトルール

Vue 3 + Vite + Firebase 構成の「ヌけないアダルト動画の情報を共有する」サービス。
修正プロジェクトの管理ファイル: 修正案.txt / problem.txt / progress.txt

## ⚠️ 絶対に守るべきルール(最重要・常時適用)

### ルール1: 不明点ゼロで作業する

- 全ての作業において、不明点が1つでもあれば**必ず作業を止めてユーザーに質問する**
- 推測や仮定で実装を進めることを禁止する
- 常に一切の不明点がない状態でのみ作業を行う

### ルール2: Phase/Work 単位で必ず停止する

- 全てのタスクは progress.txt の Phase / Work セクション単位で管理する
- **1つの Phase または Work が終了したら必ず作業を停止し、ユーザーの指示を仰ぐ**
- ユーザーの指示なしに次の Phase / Work へ勝手に進むことを絶対に禁止する

### ルール3: 問題対応プロセスの徹底

問題点・修正点が発生した際は、必ず以下の順序で対応する:

```
1. 問題共有(ユーザーから共有 or 発見を報告)
2. problem.txt に問題点を追加(該当セクションへ、なければ新セクション作成)
3. problem.txt を基にタスクを切り出し progress.txt に追加
4. ユーザーの指示を受けてから修正作業を開始
```

- このプロセスの省略・順序変更を禁止する
- problem.txt / progress.txt への記録前に修正作業を始めてはならない

### ルール4: 作業終了後はコミット・push・本番反映まで行う(2026-08-14 追加/更新)

1つの作業(Work)が終了するたびに、以下を必ず実行する:

1. **git commit**(コミットせず次の作業へ進むことを禁止)
   - コミット形式: `<type>: <説明>`(feat / fix / refactor / docs / test / chore)
   - コミット前に progress.txt のステータス更新も済ませ、変更に含める
2. **git push**(origin/main へ push する)
3. **本番環境への反映**(ユーザーが本番環境で動作確認できる状態にする)
   - フロント変更: `npm run build` → `firebase deploy --only hosting`
   - Firestoreルール変更: `firebase deploy --only firestore:rules`
   - Functions変更: `firebase deploy --only functions`
   - 反映後、ユーザーに本番URLと確認ポイントを伝える

- **注意**: 本番反映が他機能を壊すリスクがある場合(例: 認証実装前のルール強化)は、
  ルール1に従い反映前に必ずユーザーへ確認・影響範囲を報告する

## 管理ファイルの役割

- **修正案.txt**: アプリ全体の調査結果と仕様提案(2026-08-14 作成)
- **problem.txt**: 問題点の記録(セクションA〜F、ステータス管理)
- **progress.txt**: Phase/Work 単位のタスク一覧(Sonnetで実装可能な粒度)

## 技術メモ

- Firebase プロジェクト: nukebuy(Hosting / Auth / Firestore / Functions asia-northeast1)
- 完了前チェック: `npm run build` が通ること(TypeScript未導入のため tsc は対象外)
- console.log をコミットに含めない(グローバルルール準拠)
