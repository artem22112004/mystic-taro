import { BottomNav } from "@/components/ui/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mystical-gradient">
      <main className="pb-20 max-w-lg mx-auto min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
