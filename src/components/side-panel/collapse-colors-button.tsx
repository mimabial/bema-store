"use client";

import {useState} from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
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

import {type MenuColor} from '@/types/client';
import {useSearchParams} from "next/navigation";
import {useQuery} from "@/hooks/useQuery";
import {ChevronRight} from "@/components/icons";

interface CollapseColorsButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: MenuColor[];
  isOpen: boolean ;
}

export function CollapseColorsButton({
  icon: Icon,
  label,
  submenus,
  isOpen,
  active
}: CollapseColorsButtonProps) {

  const searchParams = useSearchParams();

  const colorParams =  searchParams.get('color')
  const { addQuery, removeQuery } = useQuery({ scroll: true });
  const colors = new Set(colorParams ? colorParams.split(',') : [])

  const handleChange = (option: string) => {
    if(!colorParams) colors.add(option)
    else{
      if (colors.has(option)) colors.delete(option)
      else colors.add(option)
    }
    if (colors.size === 0) removeQuery('color');
    else addQuery('color', Array.from(colors));
  };
  const isSubmenu = submenus.length > 0
  const [isCollapsed, setIsCollapsed] = useState<boolean>(!isSubmenu);

  return isOpen  ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-90 mb-1"
        asChild
      >
        <Button
          variant={ active ? "secondary" : "ghost"}
          className="w-full justify-start h-10 rounded-sm"
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Icon size={18} />
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap border border-muted p-1 rounded-md",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronRight
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        { submenus?.map((color, index) => (
          <Button
            key={index}
            variant={colors.has(color.name) ? "secondary" : "ghost"}
            className="w-full justify-start h-10 mb-1 gap-1.5 rounded-sm"
            onClick={() => handleChange(color.name)}
          >
              <span className="pr-3">
                <div className='peer h-4 w-4 shrink-0 rounded-sm border border-muted focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring'
                  style={{
                    backgroundColor: color.value ?? "",
                    borderColor: color.value ?? "",
                  }}
                  id={color.id}
                />
                </span>
              <label
                className={cn(
                  "max-w-[170px] truncate capitalize",
                  isOpen
                    ? "translate-x-0 opacity-100 text-xs"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {color.name}
              </label>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={ "ghost"}
                className="w-full justify-start h-10 mb-1"
              >
                <div className={`w-full items-center flex ${isOpen ? "justify-between" : "justify-center"}`}>
                  <div className="flex items-center">
                    <span className={cn(!isOpen ? "" : "mr-4")}>
                      <Icon size={18} />
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        !isOpen ? "opacity-0 hidden" : "opacity-100"
                      )}>{label}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus?.map((color, index) => (
          <DropdownMenuItem key={index} asChild>
            <div className="cursor-pointer">
              <p className="max-w-[180px] truncate">{color.name}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
