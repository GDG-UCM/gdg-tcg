import "./globals.css";
import IntroAnimation from "../components/IntroAnimation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <IntroAnimation />
        {children}
      </body>
    </html>
  );
}
