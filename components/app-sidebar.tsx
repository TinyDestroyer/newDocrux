"use client";

import {
  BookText,
  Calendar,
  Gem,
  Home,
  Inbox,
  MessageSquareCode,
  Search,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { UserButton } from "./auth/user-button";
import Logo from "@/app/(site)/_components/Logo";

// Menu items.
const items = [
  {
    title: "Conversations",
    url: "/dashboard",
    icon: MessageSquareCode,
  },
  {
    title: "Documents",
    url: "/products",
    icon: BookText,
  },
  {
    title: "Get Plus",
    url: "/getplus",
    icon: Gem,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarContent className="bg-slate-900 rounded-t-md">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 bg-slate-800 rounded-md">
            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title} className="text-white">
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <Icon />
                        <p>{item.title}</p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-slate-900 p-1 rounded-b-md">
        <div className="bg-slate-800 rounded-md p-2">
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
