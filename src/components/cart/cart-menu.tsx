import {X} from "@/components/icons";
import {Separator} from "@radix-ui/react-separator";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {api} from "@/trpc/react";
import {CartItemCard} from "@/components/cart/cart-item";
import {useCart} from "@/context/cart-provider";
import {Button} from "@/components/ui/button";
import {useSession} from "@/context/session-provider";
import { getCartDescription } from "@/lib/utils/helpers";
import {ClearCartConfirmation} from "@/components/cart/clear-cart-confirmation";
import {useCartActions} from "@/hooks/use-cart-actions";

import {Textarea} from "@/components/ui/textarea";
import {type CartItemPlus} from "@/types/cart";

type CartMenuProps = {
  isOpen: boolean;
}

export const CartMenu = ({isOpen}: CartMenuProps) => {

  const { user} = useSession();
  const {
    toggleCart,
    getCartQuantity,
    cartItems: guestItems,
    amount,
    ref0,
    ref1,
    instructions,
    setInstructions,
  } = useCart();
  const { createCheckOutSession } = useCartActions();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const items: CartItemPlus[] = [];

  let totalQuantity = {
    boxes: 0,
    bunches: 0,
  };

  if(user) {
    const {data} = api.cart.getCartItemsPlus.useQuery();

    if (data) {
      const temp= {boxes: 0, bunches: 0};
      for (const item of data) {
        temp.boxes += item.cartItem.boxes
        temp.bunches += item.cartItem.bunches
        items.push(item)
      }
      totalQuantity = temp;
    }
  } else totalQuantity = getCartQuantity();

  const handleReservation = async () => {
    setLoading(true);
    await createCheckOutSession()
    setLoading(false);
    toggleCart()
  }

  const getTotalQuantityString = () => {
    let boxes = ''
    let bunches = ''
    if(totalQuantity.boxes > 0) {
      boxes += ` ${totalQuantity.boxes} box`
      if(totalQuantity.boxes > 1) boxes += 'es '
      else boxes += ' '
      if(totalQuantity.bunches > 0) boxes += '+'
    }
    if(totalQuantity.bunches > 0) {
      bunches += ` ${totalQuantity.bunches} bunch`
      if(totalQuantity.bunches > 1) bunches += 'es '
    }
    return boxes + bunches
  }

  return (
      <div>
        <div className={`${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        } fixed inset-0 z-50 bg-black/80 transition-opacity ease-in-out duration-500`}/>
        <div
          className={`${
            isOpen ? "translate-x-0" : "translate-x-full"
          } fixed inset-y-0 z-50 flex h-screen w-screen justify-end transform transition ease-in-out 
          duration-500 sm:duration-700`}
        >
          <div className='backdrop flex items-start justify-end'>
            <div ref={ref0} className="invisible md:visible relative right-2 z-20 top-2 flex flex-col
            items-center space-y-2">
              <Button
                onClick={() => toggleCart()}
                className="rounded-md w-8 h-8"
                variant="outline"
                size="icon"
              >
                <X className="h-4 w-4 transition-transform ease-in-out
                duration-700" />
              </Button>
              {(totalQuantity.boxes > 0 || totalQuantity.bunches > 0) && <ClearCartConfirmation />}
            </div>
          </div>
          <div
            ref={ref1}
            className={`sheet mt-2 rounded-sm gap-4 bg-background p-6 overflow-y-scroll shadow-xl right-0 h-full 
            w-[30rem] border-l flex transform flex-col justify-start sm:max-w-lg `}
          >
            <div className="sheet-content flex h-5/6 flex-col gap-6 ">
              <div className="sheet-header flex flex-col space-y-2 text-center sm:text-left">
                <div className="sheet-title py-2 text-sm font-semibold text-neutral-900 flex justify-between">
                  {getCartDescription(totalQuantity)}
                </div>
                <Separator className=' bg-border h-[1px] w-full'/>
              </div>
              {totalQuantity.boxes > 0 || totalQuantity.bunches > 0 ? (
                <div className='flex flex-col h-full justify-between'>
                  <div className="flex h-fit w-full flex-col gap-2 overflow-y-auto">
                    {items
                      ? items?.map((el) => {
                        return <div key={el.cartItem.id}>
                          <Separator className='first:hidden last:hidden shrink-0 bg-border h-[1px] w-full'/>
                          <CartItemCard key={el.cartItem.id} item={el}/>
                        </div>
                      })
                      : guestItems
                        ? guestItems?.map((el) => {
                          return <>
                            <Separator className='first:hidden last:hidden shrink-0 bg-border h-[1px] w-full'/>
                            <CartItemCard key={el.cartItem.id} item={el}/>
                          </>
                        })
                        : ""}
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <div className='min-h-36 pb-4'>
                      <Textarea
                        className='h-full rounded-none text-md font-medium'
                        placeholder="Special instructions for seller"
                        rows={6}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>
                    <div className='flex justify-between'>
                      <div className="flex space-x-2 items-end">
                        <span className="text-xl ">Total</span>
                        <span
                          className="text-md font-semibold text-muted-foreground pb-1">({getTotalQuantityString()}) :</span>
                      </div>
                      <span className="text-2xl font-extrabold">{amount} €</span>
                    </div>
                    <div className='flex justify-between space-x-2'>
                      <Button
                        variant='outline'
                        className='h-14 w-full text-center font-semibold rounded-sm border-2 border-primary'
                        onClick={() => {
                          router.push('/cart')
                          toggleCart()
                        }}
                      >
                        View Cart
                      </Button>
                      <Button
                        className='h-14 w-40 text-center font-semibold rounded-sm border-2 border-primary'
                        onClick={() =>
                          handleReservation()
                        }
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex h-full flex-col space-y-4 justify-center items-center">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/empty-cart.png"
                      alt="Empty cart"
                      fill
                      className='object-contain'
                    />
                  </div>

                  <Button
                    onClick={() => {
                      router.push('/flowers')
                      toggleCart()
                    }}
                    variant='default'
                    className='
                      h-10
                      rounded-sm
                      text-sm
                      font-medium
                      hover:bg-green-600
                      pb-2'
                  >
                    Continue Browsing
                  </Button>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

  );
};
