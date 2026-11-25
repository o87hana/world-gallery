# World Gallery クライアント会議資料

最終更新: 2026-09-19

## 1. プロジェクトの目的

Hana Murakamiさんの作品を「場所」と結び付け、3D地球儀とGalleryから閲覧できる日英対応ポートフォリオを構築します。編集者はSanity Studioから、プログラムを変更せずに作品を追加・編集・公開できます。

## 2. 現在利用できる主な機能

- 3D地球儀と作品ピン
- 地球儀から作品詳細への移動
- Galleryのタイトル検索
- 5カテゴリの複数選択フィルタ
- 検索・カテゴリ状態のURL保持
- 日本語／英語切替
- 英訳未入力時の日本語フォールバック
- 文章、単画像、画像グリッド、余白、区切り線による作品ページ構成
- Sanity Studioからの作品管理
- 公開／非公開制御
- 管理者Preview Mode
- 日英Aboutページ
- Contactフォーム
- Cloudflare Turnstileとhoneypotによるbot対策
- 作品別SEO、OG画像、canonical、hreflang
- sitemapとrobots
- 320px幅からデスクトップまでのレスポンシブ対応

公開サイト: [https://world-gallery-hana-murakamis-projects.vercel.app/](https://world-gallery-hana-murakamis-projects.vercel.app/)

Sanity Studio: [https://world-gallery-studio.sanity.studio/](https://world-gallery-studio.sanity.studio/)

## 3. 会議での推奨デモ順

1. 日本語トップで地球儀を操作する
2. ピンを選択して作品詳細を開く
3. 同じ作品のままJA／ENを切り替える
4. Galleryで検索と複数カテゴリ選択を行う
5. AboutとContactを確認する
6. Sanity Studioへログインする
7. 既存作品を開き、Content Blocksの構成を説明する
8. テスト作品を`Published: OFF`で作成する
9. Previewの運用方法を説明する
10. 公開承認後に`Published: ON`へする流れを確認する

編集操作の詳細は[編集者向け利用ガイド](./editor-guide-ja.md)を参照してください。

## 4. クライアントと確認したい運用事項

- 誰が編集者になるか
- 誰が最終公開を承認するか
- 日本語だけで先行公開してよいか
- 英訳の担当者と確認フロー
- 作品画像の著作権・肖像権確認担当
- Slugを変更する必要がある場合の承認者
- 非公開作品のPreviewリンクを渡す方法
- Contactメールの受信担当者
- 作品削除前の確認・バックアップ手順
- Sanity Studio管理画面URLの配布対象

## 5. 公開運用の推奨フロー

1. 編集者が`Published: OFF`で作品を作成
2. 日本語内容、画像、位置情報を確認
3. 英訳がある場合は英語内容を確認
4. 管理者または承認者がPreviewで確認
5. 修正を反映して再確認
6. `Published: ON`へ変更してPublish
7. 地球儀、Gallery、日英作品詳細、スマートフォンを確認

誤公開防止のため、作成担当者と公開承認者を分ける運用を推奨します。

## 6. 現在の確認・設定待ち

- Studio内Preview連携（Presentation設定済み）
- 編集者アカウントの招待と権限
- Editor権限のAPIトークン失効とViewerトークンへの最小権限化
- 本番Contactメールの実送信確認（送信成功。受信箱確認待ち）
- Sanity公開変更のWebhook自動反映（HTTP 200確認済み）
- Vercel／Sanity／Resendを含む最終本番受け入れ

これらは作品編集機能そのものとは分けて管理し、認証情報を会議資料へ記載しません。

## 7. 品質確認状況

- 自動テスト: 20ファイル、91件成功
- TypeScript型チェック: 成功
- ESLint: 成功
- Next.js本番ビルド: 成功
- 100作品相当の地球儀データ受け渡しテスト: 成功
- 320px幅で主要画面の横スクロールなし
- 非公開作品の通常アクセス遮断: 確認済み
- 不正Preview secretの拒否: 確認済み
- SEO metadata、sitemap、robots、404 noindex: 確認済み

## 8. 会議後に記録する決定事項

| 項目 | 決定内容 | 担当 | 期限 |
|---|---|---|---|
| Studio URL |  |  |  |
| 編集者 |  |  |  |
| 公開承認者 |  |  |  |
| 英訳フロー |  |  |  |
| Contact受信者 |  |  |  |
| Preview共有方法 |  |  |  |
| 公開予定日 |  |  |  |
