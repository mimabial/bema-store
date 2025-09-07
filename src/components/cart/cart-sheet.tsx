
"use client"

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Sheet, SheetHeader, SheetTrigger, SheetContent, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { buttonVariants, Button } from '@/components/ui/button';
import { Avatar } from '../ui/avatar';
import {useCart} from "@/context/cart";
import {api} from "@/trpc/react";
import {CartItemCard} from "@/components/cart/cart-item";
import {Separator} from "@radix-ui/react-separator";

const CartSheet = () => {
    const router = useRouter();
    const { getCartQuantity, cartItems: guestItems, amount } = useCart();
    const { data: cartItems } = api.cart.getCartItems.useQuery();
    let totalQuantity = 0;

    if (cartItems) {
        cartItems?.forEach((el) => {
            totalQuantity += el.quantity;
        });
    } else {
        totalQuantity = getCartQuantity();
    }

    return (
        <Sheet>
            <SheetTrigger asChild className="group flex items-center">
                <button
                    className='flex-col h-10 justify-center pr-1'
                >
                    <div  className='relative bottom-2 h-0 w-0'>
                        <Avatar 
                            className='
                                h-5 
                                w-5
                                justify-center 
                                items-center
                                shadow
                                text-primary
                                bg-white
                                bg-opacity-90
                                text-xs
                                rounded-lg
                                font-semibold
                            '
                        >
                            {totalQuantity}
                        </Avatar>
                    </div>
                    <ShoppingBag
                        strokeWidth='2px'
                        className='h-5 w-5 text-primary'
                    />
                </button>
            </SheetTrigger>
            <SheetContent className="flex w-[30rem] flex-col justify-start sm:max-w-lg px-12">
                <SheetHeader >
                    <SheetTitle className='py-3 text-sm font-semibold text-neutral-900'>
                        {
                            totalQuantity === 0
                                ? 'Your cart is currently empty'
                                : totalQuantity > 1
                                    ? `${totalQuantity} products in your cart`
                                    : `${totalQuantity} product in your cart`
                        }
                    </SheetTitle>
                    <Separator className='shrink-0 bg-border h-[1px] w-full justify-self-start' />
                </SheetHeader>
                {totalQuantity > 0 ? (
                    <div className='flex flex-col h-full justify-between'>
                        <div className="flex h-fit w-full flex-col gap-4 overflow-y-auto">
                            {cartItems
                                ? cartItems?.map((el) => {
                                    return <>
                                        <Separator className='first:hidden last:hidden shrink-0 bg-border h-[1px] w-full' />
                                        <CartItemCard key={el.id} item={el}/>
                                    </>
                                })
                                : guestItems
                                    ? guestItems?.map((el) => {
                                        return <>
                                            <Separator className='first:hidden last:hidden shrink-0 bg-border h-[1px] w-full' />
                                            <CartItemCard key={el.id} item={el}/>
                                        </>
                                    })
                                    : ""}
                        </div>

                        <SheetFooter>
                            <div className="flex flex-col gap-4 w-full">
                                <h6 className="text-2xl font-semibold">Total: ${amount}</h6>
                                <div className='flex justify-between'>
                                    <SheetClose asChild>
                                        <Link href='/cart' className={buttonVariants({
                                            variant: 'outline',
                                            className: 'h-14 w-40 text-center font-semibold rounded-none border-2 border-primary',
                                        })}>
                                            View Cart
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        {/*<Button*/}
                                        {/*    className='h-14 w-40 text-center font-semibold rounded-none border-2 border-primary'*/}
                                        {/*    onClick={() =>*/}
                                        {/*        createCheckOutSession(cartItems ? cartItems : guestItems)*/}
                                        {/*    }*/}
                                        {/*>*/}
                                        {/*    Check Out*/}
                                        {/*</Button>*/}
                                        <Button
                                            className='h-14 w-40 text-center font-semibold rounded-none border-2 border-primary'
                                            onClick={() =>
                                                router.push('/checkout')
                                            }
                                        >
                                            Check Out
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>
                        </SheetFooter>
                    </div>
                ) : (
                    <div className="flex h-full flex-col space-y-1 justify-items-stretch items-center">
                        <div className="relative mb-4 aspect-square w-full text-muted-foreground">
                            <Image
                                src="/empty-cart.png"
                                alt="Empty cart"
                                fill
                                className='object-contain'
                            />
                        </div>
                        <SheetClose asChild>
                            <Button
                                onClick={() => router.push('/products')}
                                variant='default'
                                size='lg'
                                className='h-14
                                    rounded-lg
                                    text-md
                                    font-semibold
                                    w-full
                                    hover:bg-green-600'
                            >
                                Continue browsing
                            </Button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default CartSheet;
