"use client";

import { useState } from "react";
import {ChevronDown, Dot, SunMoon} from "lucide-react";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {useTheme} from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Openings} from "@/context/user-menu-provider";

interface CollapseMenuButtonProps {
  isOpen: Openings;
}

type Theme = {
  label: string;
  value: string;
}

const themes: Array<Theme> = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "System",
    value: "system",
  },
];

export function ThemeMenuButton({
  isOpen,
}: CollapseMenuButtonProps) {

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { theme: nextTheme,setTheme } = useTheme();
  return isOpen === Openings.True ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={"ghost"}
          className="w-full justify-start h-10"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
               <SunMoon size={18}/>
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen === Openings.True
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                Theme
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen === Openings.True
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {themes.map((theme, index) => (
          <Button
            key={index}
            variant={"ghost"}
            className="w-full justify-start h-10 px-2 gap-1.5"
            onClick={() => setTheme(theme.value)}
          >
              <span className="">
                <Dot size={36} className={theme.value === nextTheme ? "text-primary" : "text-transparent"}/>
              </span>
              <p
                className={cn(
                  "max-w-[170px] truncate",
                  isOpen === Openings.True
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {theme.label}
              </p>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : isOpen === Openings.False ? (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={ "ghost"}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-center">
                  <div className="flex items-center">
                    <span className={cn(isOpen === Openings.False ? "" : "mr-4")}>
                      <SunMoon size={18}/>
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === Openings.False ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Theme
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            Theme
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme, index) => (
          <DropdownMenuItem key={index} onClick={() => setTheme(theme.value)}>
            {theme.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
