import { AuthGuard } from "@/components/auth/auth-guard";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <DashboardShell>{children}</DashboardShell>
      </SidebarProvider>
    </AuthGuard>
  );
}