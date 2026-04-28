import type { Metadata } from 'next';
import "./global.css";

export const metadata: Metadata = {
  title: 'Queens Eatery | Staff Panel',
  description: 'Staff panel for Queens Eatery - Order Management System',
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