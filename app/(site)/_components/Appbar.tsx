"use client";

import React, { useState } from "react";
import Logo, { LogoMobile } from "./Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/auth/user-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

function DesktopNavbar() {
  return (
    <div className="hidden bg-slate-800 md:block">
      <nav className="flex items-center justify-end px-8 h-fit border-0">
        <SidebarTrigger className="text-white" />
        <div className="flex h-full">
          {items.map((item) => (
            <NavbarItem key={item.label} link={item.link} label={item.label} />
          ))}
        </div>
      </nav>
    </div>
  );
}

const items = [
  { label: "Conversation", link: "/conversations" },
  { label: "Documents", link: "/products" },
  { label: "GetPlus+", link: "/getplus" },
];

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-transparent"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground hover:bg-transparent hover:text-red-600",
          isActive && "text-red-600"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-red-600 md:block" />
      )}
    </div>
  );
}

export default Navbar;
