# World Gallery 開発・公開・復旧ガイド

最終更新: 2026-09-19

この資料は、開発者・管理者がWorld Galleryをセットアップ、検証、公開、復旧するための手順です。編集者の日常操作は[編集者向け利用ガイド](./editor-guide-ja.md)を参照してください。

## 1. サービス構成

| 対象 | サービス | ソース |
|---|---|---|
| 公開サイト | Vercel / Next.js | `apps/web` |
| CMS | Sanity | Project `kmx5m7v5` / dataset `production` |
| Studio | Sanity Studio | `apps/world-gallery-studio` |
| Contact送信 | Resend | `apps/web/src/app/api/contact` |
| bot対策 | Cloudflare Turnstile | Contactフォーム |

## 2. 新しい環境のセットアップ

1. リポジトリを取得します。
2. Node.js 24を有効にします。
3. WebとStudioでそれぞれ`npm ci`を実行します。
4. `apps/web/.env.example`を`apps/web/.env.local`へコピーします。
5. 秘密値を安全な管理元から設定します。
6. WebとStudioを起動します。
7. lint、型チェック、テスト、ビルドを実行します。

秘密値をチャット、Issue、Pull Request、画面共有資料へ貼り付けないでください。

## 3. Vercel環境変数

Vercel Dashboardの対象Webプロジェクトで、Production／Preview／Developmentの必要な環境へ設定します。

```bash
cd apps/web
vercel env ls
```

ローカルへ取得する場合は、対象プロジェクトとscopeを確認してから実行します。次のコマンドは`.env.local`を上書きします。

```bash
vercel env pull .env.local --environment=development
```

設定変更後は再デプロイし、新しいDeploymentが変更後の値を使用していることを確認します。公開変数以外はブラウザへ露出させません。

## 4. 通常の公開手順

### Web

1. WebとStudioの品質チェックをすべて成功させます。
2. 変更内容と環境変数の不足がないことを確認します。
3. GitHubへpushし、GitHub Actionsを通過させます。
4. Vercel Previewで主要ページを確認します。
5. 承認後にProductionへ反映します。
6. 日本語／英語、地球儀、Gallery、作品詳細、Contactを確認します。

### Studio

```bash
cd apps/world-gallery-studio
npm run lint
npm run typecheck
npm run build
npm run deploy
```

Studio公開後、ログイン、Work一覧、既存作品の編集画面が開けることを確認します。

## 5. Sanity作品の公開

一般公開には次の両方が必要です。

1. 作品フィールドの`Published`をONにする
2. Sanityの`Publish`を実行する

公開データは1時間ごとに自動再検証されます。再検証中にSanity取得が失敗した場合は直前の成功データが維持され、キャッシュがない初回取得の失敗はWebのerror UIに表示されます。Preview Modeはキャッシュを使用しません。

Webhookによる即時再検証は未実装です。即時かつ確実に反映する必要がある場合はWebを再デプロイしてください。TASK-031〜032完了後に、この暫定手順をWebhook自動反映へ更新します。

## 6. Preview確認

Previewには`PREVIEW_SECRET`とViewer権限の`SANITY_API_READ_TOKEN`を使用します。

```text
https://<web-host>/api/preview?secret=<secret>&slug=<slug>&lang=ja
```

確認後は`Exit preview`を押します。Preview URLは秘密情報を含むため、公開チャンネルへ送らないでください。

## 7. Contact確認

本番確認前に、次を確認します。

- Turnstileに本番hostnameが登録されている
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`と`TURNSTILE_SECRET_KEY`が同じwidgetの組み合わせ
- Resendで`CONTACT_FROM_EMAIL`のドメインまたは送信元が認証済み
- `CONTACT_TO_EMAIL`が正しい受信担当者

実送信テストでは、受信、Reply-To、迷惑メール振り分け、日英フォームを確認します。実際の問い合わせ本文をログへ残しません。

## 8. 障害時の切り分け

### サイト全体が開かない

1. Vercel Deploymentの状態とBuild Logsを確認します。
2. 直前の環境変数変更とGit変更を確認します。
3. 直前の正常なProduction Deploymentへロールバックします。
4. 原因修正後、全品質チェックを通して再デプロイします。

### 作品が表示されない

1. Sanityで`Publish`済みか確認します。
2. `Published`がONか確認します。
3. Project IDとdatasetが`kmx5m7v5/production`か確認します。
4. 必須項目、slug、位置情報を確認します。
5. 現行運用ではWebを再デプロイします。

### Contactだけ送信できない

1. Turnstile hostnameとキーの組み合わせを確認します。
2. Resendの送信元認証を確認します。
3. Vercel Function Logsでは、秘密値や問い合わせ本文を表示しません。
4. 障害中は受信可能な代替連絡先を案内します。

### Studioで編集できない

1. 正しいSanityアカウントでログインしているか確認します。
2. Project `kmx5m7v5`のメンバー権限を確認します。
3. datasetが`production`か確認します。
4. APIトークンを編集者へ配布して解決しないでください。

## 9. 復旧とロールバック

- Web: Vercelで直前の正常なProduction Deploymentを再昇格します。
- コード: 正常なGitコミットを特定し、修正用ブランチで変更を戻して再検証します。
- 作品の誤公開: まず`Published`をOFFにしてPublishし、現行運用ではWebを再デプロイします。
- Sanityの誤編集: 対象ドキュメントの履歴を確認し、内容を復元してからPublishします。
- 削除: テスト作品以外を削除しません。削除が必要な場合は対象と復旧方法を事前確認します。

不可逆なデータ操作、dataset削除、トークン失効、ドメイン変更は対象を再確認し、管理者承認後に実行します。

## 10. 定期確認

- GitHub Actionsが継続して成功している
- Vercel／Sanity／Resend／Turnstileの管理者が最新
- 不要なEditor／Writeトークンが残っていない
- Contact受信先と送信元認証が有効
- Sanityの使用量とVercelのエラー状況に異常がない
- 編集者ガイドのURLと担当者情報が最新
