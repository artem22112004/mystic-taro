import { BottomNav } from "@/components/ui/bottom-nav";
import { Onboarding } from "@/components/ui/onboarding";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mystical-gradient">
      <Onboarding />
      <main className="pb-20 max-w-lg mx-auto min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
