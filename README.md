# お店のかんたん管理

Next.js で作った、iPhone / iPad / PC 対応のシンプルな店舗管理画面です。

## 現在できること
- 売上・仕入・経費・未払いを大きなブロックで確認
- 取引を簡単入力
- 現金残高を自動計算
- ブラウザの localStorage に保存
- レシート・請求書ボタン（OCRは次段階）
- Google Cloud Run 用 Dockerfile

## 開発
npm install
npm run dev

## GCP Cloud Run
gcloud run deploy omise-kantan-kanri --source . --region asia-northeast1 --allow-unauthenticated

※ 本番では Firestore、認証、OCR、弥生CSV出力を追加する想定です。
