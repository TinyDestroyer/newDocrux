import Appbar from "@/app/(site)/_components/Appbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col">
      {/* Appbar */}
      <Appbar />

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-grow overflow-y-auto min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
