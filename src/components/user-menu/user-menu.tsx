import {ChevronLeft, Ellipsis, LayoutGrid, X} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {useRouter, usePathname} from "next/navigation";

import {LocaleMenuButton} from "@/components/user-menu/locale-menu-button";
import {Openings, useUserMenu} from "@/context/user-menu-provider";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {getUserMenuList} from "@/lib/menu-list";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {CollapseMenuButton} from "@/components/side-panel/collapse-menu-button";
import {Roles} from "@/server/db/schema/enums";
import {ThemeMenuButton} from "@/components/user-menu/theme-menu-button";
import {useSession} from "@/context/session-provider";
import {SignoutConfirmation} from "./signout-confirmation";
import {Paths} from "@/lib/constants";

export const UserMenu = ({ isOpen }: { isOpen: Openings }) => {
  const router  = useRouter();
  const { toggleInnerMenu, toggleOuterMenu, ref0, ref1 } = useUserMenu();
  const pathname = usePathname();
  const menuList = getUserMenuList(pathname);
  const { user } = useSession()

  if(user?.role === Roles[1]) {
    menuList.unshift({
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        },
      ]
    })
  }

  const login = () => {
    const from = pathname.slice(3)
    const loginPath = !!from ? `/login?from=${encodeURIComponent(from)}` : Paths.Login;
    router.replace(loginPath);
    toggleOuterMenu()
  }

  return (
      <div>
        <div className={`${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        } fixed inset-0 z-20 bg-black/80 transition-opacity ease-in-out duration-300`}/>
        <div
          className={`${isOpen ? "translate-x-0" : "translate-x-full"} fixed inset-y-0 z-20 flex h-screen w-screen 
          justify-end transform transition ease-in-out duration-300 sm:duration-700`}
        >

            <div ref={ref0} className={`invisible md:visible relative right-2 z-20 top-2 flex flex-col items-center space-y-2`}>
              <Button

                onClick={() => toggleOuterMenu()}
                className="rounded-sm w-8 h-8 flex-shrink-0 shadow-none"
                variant="outline"
                size="icon"
              >
                <X
                  className={cn(
                    "h-4 w-4",
                  )}
                />
              </Button>
              <Button
                onClick={() => toggleInnerMenu?.()}
                className="rounded-sm w-8 h-8"
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

          <div
            ref={ref1}
            className={`sheet mt-2 rounded-sm transition-[width] ease-in-out duration-300 gap-4 bg-background 
            shadow-xl h-full border-l flex transform flex-col justify-start sm:max-w-lg 
            ${isOpen === Openings.False ? "w-[90px] pt-4 pb-2 pr-4" : "w-72 pt-4 pb-2 pr-4"}`}
          >
            <div className="sheet-content flex h-full flex-col">
              <div className="sheet-header flex flex-col space-y-2 text-center sm:text-left">
              <div className="sheet-title text-sm font-semibold text-neutral-900 flex items-center
              transition-transform ease-in-out duration-300 px-4">
                {user ? <div className={`flex items-center gap-2 `}>
                  <Image
                    src={user.avatar ?? "/img/avatar.jpg"}
                    alt="Avatar"
                    className="block overflow-hidden rounded-full leading-none shadow-sm border border-muted"
                    width={40}
                    height={40}
                  />
                  <h2 className={`text-primary whitespace-nowrap transition-[transform,opacity,display] ease-in-out
                      duration-300 ${isOpen === Openings.False
                    ? "translate-x-96 opacity-0 hidden"
                    : "translate-x-0 opacity-100"}`}>{user.email.split("@")[0]}</h2>
                </div> : <Button
                  className='w-full rounded-sm mt-1'
                  variant='secondary'
                  onClick={() => login()
                }>
                  {/*<Link href='/login'>Sign In</Link>*/}
                  Login
                </Button>}

                </div>
               </div>
              <ScrollArea className="[&>div>div[style]]:!block">
                <nav className="h-full w-full">
                  <ul
                    className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)]
                    lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2 pt-3">
                    {user && menuList.map(({groupLabel, menus}, index) => (
                      <li className={cn("w-full", user?.role !== Roles[1] && groupLabel ? "pt-3" : "")} key={index}>
                        {(isOpen === Openings.True && groupLabel) ?? isOpen === Openings.Undefined ? (
                          <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                            {groupLabel}
                          </p>
                        ) : isOpen === Openings.False && groupLabel ? (
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
                                        className={`w-full h-10 mb-1 ${isOpen === Openings.True ? "justify-start" : "justify-center"}`}
                                        asChild
                                      >
                                        <Link href={href} onClick={() => toggleOuterMenu?.()}>
                                <span
                                  className={cn(isOpen === Openings.False ? "" : "mr-4")}
                                >
                                  <Icon size={18}/>
                                </span>
                                          <p
                                            className={cn(
                                              "max-w-[200px] truncate",
                                              isOpen === Openings.False
                                                ? "translate-x-96 opacity-0 hidden"
                                                : "translate-x-0 opacity-100"
                                            )}
                                          >
                                            {label}
                                          </p>
                                        </Link>
                                      </Button>
                                    </TooltipTrigger>
                                    {isOpen === Openings.False && (
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
                    <li className={cn("w-full",)}>
                      {isOpen === Openings.True ? (
                        <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                          Options
                        </p>
                      ) : isOpen === Openings.False ? (
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger className="w-full">
                              <div className="w-full flex justify-center items-center">
                                <Ellipsis className="h-5 w-5"/>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>Options</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p className="pb-2"></p>
                      )}
                      <div className="w-full">
                        <LocaleMenuButton
                          isOpen={isOpen}
                        />
                      </div>
                      <div className="w-full">
                        <ThemeMenuButton
                          isOpen={isOpen}
                        />
                      </div>
                    </li>
                    <li className={`w-full ${!user && 'hidden'}`}>
                      <SignoutConfirmation isOpen={isOpen} user={!!user} />
                    </li>
                  </ul>
                </nav>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
  );
};
