import Appbar from "@/app/(site)/_components/Appbar";
import { ThemeProvider } from "next-themes";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="max-h-screen min-h-screen w-full bg-[#141414] flex flex-col">
      <Appbar />
      <div className="flex flex-grow overflow-y-auto h-full w-full">{children}</div>
    </div>
  );
};

export default ProtectedLayout;
