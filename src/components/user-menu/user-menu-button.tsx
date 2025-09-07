
"use client"

import { User } from '@/components/icons';
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useUserMenu } from "@/context/user-menu-provider";
import {Button} from "@/components/ui/button";
import {Paths} from "@/lib/constants";
import {useSession} from "@/context/session-provider";

const UserMenuButton = () => {
  const pathname = usePathname();
  const { toggleOuterMenu } = useUserMenu();
  const { user } = useSession()
  return (
    <Button
      variant='ghost'
      size='icon'
        onClick={toggleOuterMenu}
        className={`group flex items-center flex-col justify-center ${pathname.includes(Paths.Dashboard) ? "w-12 h-12 rounded-full" : "w-10 h-10"}`}
    >
      {
        pathname.includes(Paths.Dashboard) ? (
          <Image
            src={user?.image ?? "/avatar.jpg"}
            alt="Avatar"
            className="block overflow-hidden rounded-full leading-none shadow-sm border border-muted"
            width={45}
            height={45}
          />
        ) : (
          <User
              strokeWidth='2px'
              className='h-5 w-5 text-primary'
          />
        )
      }
    </Button>
  );
}

export default UserMenuButton;
