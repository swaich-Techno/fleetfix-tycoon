export const metadata = {
  title: "FleetFix Tycoon",
  description: "Repair empire game prototype",
  manifest: "/manifest.json",
  themeColor: "#ea580c",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#ea580c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="FleetFix Tycoon" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="FleetFix" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
