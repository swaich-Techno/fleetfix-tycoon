export const metadata = {
  title: "FleetFix Tycoon",
  description: "Repair empire game prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
