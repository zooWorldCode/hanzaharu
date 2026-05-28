export default function EntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh">{children}</div>;
}
