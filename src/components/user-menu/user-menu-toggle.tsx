import {ChevronLeft} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {useUserMenu, Openings} from "@/context/user-menu-provider";
import {type RefObject} from "react";

export function UserMenuToggle({ref}: {ref: RefObject<HTMLDivElement>}) {
  const { isOpen, toggleInnerMenu } = useUserMenu();
  return (
    <div ref={ref} className="invisible lg:visible relative top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => toggleInnerMenu?.()}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === Openings.True ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
