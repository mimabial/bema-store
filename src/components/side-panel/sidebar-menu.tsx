"use client";

import Link from "next/link";
import {Ellipsis, Palette} from "@/components/icons";
import {usePathname, useSearchParams} from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/side-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import {api} from "@/trpc/react";
import {CollapseColorsButton} from "@/components/side-panel/collapse-colors-button";
import {Categories, Statuses} from "@/server/db/schema/enums";
import type {MenuGenusExtended, MenuColor} from "@/types/client";

interface MenuProps {
  isOpen: boolean;
}

export function SidebarMenu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const { data } = api.genus.deepList.useQuery();
  const flowersMap = new Map <string, MenuGenusExtended>()
  const foliagesMap = new Map <string, MenuGenusExtended>()

  const colorsSet = new Set<MenuColor>()
  const priceBox = { min: 0, max: 0 }
  const priceBunch = { min: 0, max: 0 }
  const length = { min: 0, max: 0 }

  if (data) {
    for (const row of data) {
      if (row.product_price_box > 0) {
        priceBox.min = Math.min(priceBox.min, row.product_price_box)
        priceBox.max = Math.max(priceBox.max, row.product_price_box)
      }
      if (row.product_price_bunch > 0) {
        priceBunch.min = Math.min(priceBunch.min, row.product_price_bunch)
        priceBunch.max = Math.max(priceBunch.max, row.product_price_bunch)
      }
      length.min = Math.min(length.min, row.product_length)
      length.max = Math.max(length.max, row.product_length)
      const testArray = Array.from(colorsSet.values())
      const test = testArray.find(item => item.id === row.color_id)
      if (!test) {
        colorsSet.add({
          id: row.color_id,
          name: row.color_name,
          value: row.color_value,
        })
      }
      if (row.product_status === Statuses[0]) {
        if (row.genus_category === Categories[0]) {
          let found = false
          flowersMap.forEach((value, key) => {
            if (found) return
            if (key === row.genus_id) {
              value.cultivars.push({
                id: row.cultivar_id,
                name: row.cultivar_name,
                slug: row.cultivar_slug,
              })
              found = true
            }
          })
          if (!found) {
            flowersMap.set(row.genus_id, {
              id: row.genus_id,
              name: row.genus_name,
              slug: row.genus_slug,
              cultivars: [{
                id: row.cultivar_id,
                name: row.cultivar_name,
                slug: row.cultivar_slug,
              }]
            })
          }
        } else {
          let found = false
          foliagesMap.forEach((value, key) => {
            if (found) return
            if (key === row.genus_id) {
              value.cultivars.push({
                id: row.cultivar_id,
                name: row.cultivar_name,
                slug: row.cultivar_slug,
              })
              found = true
            }
          })
          if (!found) {
            foliagesMap.set(row.genus_id, {
              id: row.genus_id,
              name: row.genus_name,
              slug: row.genus_slug,
              cultivars: [{
                id: row.cultivar_id,
                name: row.cultivar_name,
                slug: row.cultivar_slug,
              }]
            })
          }
        }
      }
    }
  }

  const colors = Array.from(colorsSet)
  const flowers = Array.from(flowersMap.values())
  const foliages = Array.from(foliagesMap.values())
  const menuList = getMenuList({pathname, flowers, foliages});

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="h-full w-full">
        <ul
          className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)]
          lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 pt-9 px-2">
          {menuList.map(({groupLabel, menus}, index) => (
            <li className={cn("w-full", groupLabel ? "" : "pt-3")} key={index}>
              {(isOpen && groupLabel) ?? isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : ! isOpen && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5"/>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({href, label, icon: Icon, active, submenus}, index) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen ? "mr-4" : "")}
                                >
                                  <Icon size={18}/>
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen
                                      ? "translate-x-0 opacity-100"
                                      : "-translate-x-96 opacity-0"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {!isOpen && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>


          ))}
          <li className={cn("w-full pt-3")}>
            {isOpen ?? isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  Filters
                </p>
             ) : !isOpen ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                <TooltipTrigger className="w-full">
                    <div className="w-full flex justify-center items-center">
                      <Ellipsis className="h-5 w-5"/>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            <div className="w-full">
              <CollapseColorsButton
                icon={Palette}
                label={'Colors'}
                submenus={colors}
                isOpen={isOpen}
                active={!!searchParams.get('color')}
              />
            </div>
          </li>

        </ul>
      </nav>
    </ScrollArea>
  );
}
