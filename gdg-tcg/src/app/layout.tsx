import './globals.css';
import IntroAnimation from '../components/IntroAnimation';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <IntroAnimation />
        <div className="relative">
          {/* Home button always visible with z-50 */}
          <Link href="/" className="absolute top-4 left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Home
          </Link>
          {children}
        </div>
      </body>
    </html>
  );
}
