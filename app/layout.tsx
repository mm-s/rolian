import "../styles/zx-spectrum.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="font-zx">{children}</body>
    </html>
  );
}

