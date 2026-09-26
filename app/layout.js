import "./globals.css";

export const metadata = {
  title: "結食堂｜夜のご予約",
  description: "結食堂の夜予約アプリ"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
