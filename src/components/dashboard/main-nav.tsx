"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import {type HTMLAttributes} from "react";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const storeId = params.storeId as string;
  const routes = [
    {
      href: `/dashboard/${storeId}`,
      label: 'Overview',
      active: pathname === `/${storeId}`,
    },
    {
      href: `/dashboard/${storeId}/images`,
      label: 'Images',
      active: pathname === `/${storeId}/images`,
    },
    {
      href: `/dashboard/${storeId}/genera`,
      label: 'Genera',
      active: pathname === `/${storeId}/genera`,
    },
    {
      href: `/dashboard/${storeId}/cultivars`,
      label: 'Cultivars',
      active: pathname === `/${storeId}/cultivars`,
    },
    {
      href: `/dashboard/${storeId}/colors`,
      label: 'Colors',
      active: pathname === `/${storeId}/colors`,
    },
    {
      href: `/dashboard/${storeId}/products`,
      label: 'Products',
      active: pathname === `/${storeId}/products`,
    },
    {
      href: `/dashboard/${storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${storeId}/orders`,
    },
    {
      href: `/dashboard/${storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${storeId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
