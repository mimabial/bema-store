import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useIsLargeScreen from "@/hooks/use-large-screen";
import {useEffect} from "react";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen: (bool?: boolean) => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {

     useEffect(() => {

    // I write this into a function for better visibility
    const handleResize = (e: MediaQueryListEvent) => {
      if (!e.matches ) setIsOpen(false)
      else setIsOpen(true)
      console.log(e.matches)
      console.log(isOpen)
    };

    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    mediaQuery.addEventListener('change', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);


  return (
    <div className="invisible absolute top-2 -right-10 z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-md w-8 h-8 shadow-sm"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
