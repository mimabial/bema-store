"use client"

import {useState, type ComponentPropsWithoutRef} from "react"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStoreModal } from "@/context/modal-provider"
import {Paths} from "@/lib/constants";
import {Blinds, CheckSquare2, ChevronDown, PlusSquare, Dock} from "@/components/icons";
import {type Store} from "@/types/store";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[] | undefined;
}

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const currentStore = items.find((item) => item.id === params.storeId);

  const [open, setOpen] = useState(false)
  const onStoreSelect = (store: Store) => {
    setOpen(false);
    console.log('another store is selected');
    router.push(`${Paths.Dashboard}/${store.id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild className='z-50'>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn(" justify-between z-50 rounded-sm w-48 px-3 capitalize",
            className)}
        >
        <Dock className="mr-2 h-4 w-4" />
        <span className='text-sm'>{currentStore?.name}</span>
        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 opacity-50 
        transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 rounded-sm">
        <Command>
          <CommandList>
            <CommandInput placeholder="search store..." />
            {items?.length === 0 && <CommandEmpty>No store found.</CommandEmpty>}
            <CommandGroup heading="Stores">
              {items.map((store) => (
                <li key={store.id}
                  className="flex items-center justify-start hover:bg-gray-100
                  rounded-sm px-2 py-1.5 text-sm hover:cursor-pointer capitalize"
                  onClick={() => {
                    setOpen(false)
                    onStoreSelect(store)
                  }}
                >
                  <Blinds className="mr-2 h-4 w-4" />
                  {store.name}
                  <CheckSquare2
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.id === store.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </li>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <div className="text-sm w-full p-1 text-left"
            >
              <Button
                  className=" cursor-pointer select-none justify-start rounded-sm
                  w-full pr-2 pl-3"
                  variant="ghost"
                  onClick={() => {
                    setOpen(false)
                    storeModal.onOpen()
                  }}
              >
                <span>Add store</span>
                <PlusSquare className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </CommandList>
          </Command>
      </PopoverContent>
    </Popover>
  );
};
