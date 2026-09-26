# 結食堂 予約アプリ

Next.js + GCP Cloud Run を想定した、結食堂の夜予約アプリ初期版です。

## 営業ルール
- 昼：ランチのみ、予約不要
- 夜：予約制
- 夜メニュー：Aコース / Bコース / アラカルト

## 画面
- `/` お客様用予約画面
- `/admin` 店舗用予約管理画面

## ローカル実行
```bash
npm install
npm run dev
```

## GCP Cloud Run
例：
```bash
gcloud run deploy musubi-shokudo \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated
```

## 初期版の保存方式
現在はブラウザの localStorage に保存します。
本番運用では Firestore へ置き換える想定です。
