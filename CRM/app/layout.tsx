import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#07090F',
};

export const metadata: Metadata = {
  title: 'SID Events CRM | Admin Portal',
  description: 'Internal CRM and event management console for SID Events.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-silk-100 text-maroon-950 min-h-screen flex flex-col selection:bg-gold-400 selection:text-maroon-950">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              document.addEventListener('contextmenu', function(e){
                var t = e.target;
                if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.closest('img') || t.closest('video') || t.closest('.no-context-menu'))) {
                  e.preventDefault();
                  return false;
                }
              }, false);
              document.addEventListener('dragstart', function(e){
                var t = e.target;
                if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) {
                  e.preventDefault();
                  return false;
                }
              }, false);
            })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
