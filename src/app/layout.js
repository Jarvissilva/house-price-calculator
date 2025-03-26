import "app/style.css";

export const metadata = {
  title: "House Price Calculator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
