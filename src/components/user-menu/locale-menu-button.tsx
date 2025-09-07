"use client";

import {useParams} from "next/navigation";
import {useState} from "react";
import {ChevronDown, Dot, Languages} from "lucide-react";

import {usePathname, useRouter} from "@/i18n/routing";
import {cn} from "@/lib/utils";
import {type Locale, locales} from "@/i18n/config";
import {Button} from "@/components/ui/button";
import {DropdownMenuArrow} from "@radix-ui/react-dropdown-menu";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useTranslations} from "next-intl";
import {Openings} from "@/context/user-menu-provider";

interface LocaleMenuButtonProps {
  isOpen: Openings;
}

export function LocaleMenuButton({

  isOpen,
}: LocaleMenuButtonProps) {
  const params = useParams()
  const pathname = usePathname();
  const t = useTranslations('intl');
  const onClick = (locale: Locale) => {
    console.log(locale)
    console.log(pathname);
    console.log(params);
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale }
    )
  }

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const router = useRouter();
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
               <Languages size={18}/>
              </span>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen === Openings.True
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {t('language')}
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
        {locales.map((locale, index) => (
          <Button
            key={index}
            variant={ "ghost"}
            className="w-full justify-start h-10 px-2 gap-1.5"
            onClick={() => onClick(locale)}
          >
              <span className="">
                <Dot size={36} className={params.locale === locale ? "text-primary" : "text-transparent"}/>
              </span>
              <p
                className={cn(
                  "max-w-[170px] truncate",
                  isOpen === Openings.True
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {t(`locale.${locale}`)}
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
                variant={"ghost"}
                className="w-full justify-start h-10 mb-1"
              >
                <div className="w-full items-center flex justify-center">
                  <div className="flex items-center">
                    <span className={cn(isOpen === Openings.False ? "" : "mr-4")}>
                      <Languages size={18}/>
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === Openings.False ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      {t('language')}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {t('language')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {t('language')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((locale, index) => (
          <DropdownMenuItem key={index} onClick={() => onClick(locale)}>
            {t(`locale.${locale}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;
}
