import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KINGS Eatery | Burgers & Brunch in Sanepa',
  description: 'Premium burgers and brunch in Sanepa, Lalitpur, Kathmandu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}