"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/layouts/footer";
import { Sidebar } from "@/components/side-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Header } from "@/app/[locale]/(main)/_components/header";

export default function SidePanelLayout({
  children
}: {
  children: ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;
  const marginLeft = sidebar?.isOpen === false ? "ml-[90px]" : "ml-64"
  return (
    <>
      <Sidebar/>
      <header
        className={cn(
          "transition-[margin-left] ease-in-out duration-300 drop-shadow-sm",
          marginLeft
        )}
      >
        <Header/>
      </header>
      <main
        className={cn(
          "main-bg min-h-[calc(100vh_-_56px)] dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          marginLeft
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          marginLeft
        )}
      >
        <Footer/>
      </footer>
    </>
  );
}
