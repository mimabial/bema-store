import Link from "next/link";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/custom-ui/button";
import { SidebarMenu } from "@/components/side-panel/sidebar-menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/side-panel/sidebar-toggle";
import Image from "next/image";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if(!sidebar) return null;


  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-20 h-screen  transition-[width] ease-in-out duration-300",
          sidebar.isOpen === false ? "w-[90px]" : "w-64"
        )}
      >
        <SidebarToggle isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen}/>
        <div className="relative h-full flex flex-col overflow-y-auto shadow dark:shadow-zinc-800">
          <div className="flex items-center justify-start w-full pt-6">
            <Button
              className={cn(
                "transition-transform ease-in-out duration-300 justify-start w-fit",
                sidebar?.isOpen === false ? "translate-x-0" : "translate-x-0"
              )}
              variant="link"
              asChild
            >
              <Link href="/">
                <Image
                  alt="logo"
                  height={40}
                  width={34}
                  quality={100}
                  priority
                  src="/logo-cropped.png"
                />
                <h1
                  className={cn(
                    "relative -bottom-7 font-shalma text-[9rem] whitespace-nowrap " +
                    "transition-[transform,opacity,display] ease-in-out duration-300",
                    sidebar.isOpen === false
                      ? "-translate-x-96 opacity-0 hidden"
                      : "translate-x-0 opacity-100"
                  )}
                >
                  ema
                </h1>
                <span className='ml-1 mb-2 tracking-wide font-extralight relative text-xs -top-3
                w-5 h-5 p-0.5 text-stone-400 rounded-sm border border-stone-300 shadow-sm bg-muted'>گل</span>
              </Link>
            </Button>
          </div>
          {/*<Separator className={`w-1/2 shadow-md ml-10 ${sidebar?.isOpen === false ? "hidden" : ""}`} />*/}
          <SidebarMenu isOpen={sidebar.isOpen}/>
        </div>
      </aside>
    </>

  );
}
