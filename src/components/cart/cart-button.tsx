"use client"
import {ShoppingBag} from '@/components/icons';

import {Avatar} from '@/components/ui/avatar';
import {useCart} from "@/context/cart-provider";
import {Button} from "@/components/ui/button";
import {useSession} from "@/context/session-provider";
import {api} from "@/trpc/react";


const Cart = () => {
	const { user } = useSession();
	const { toggleCart, getCartQuantity } = useCart();

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
			}
			totalQuantity = temp;
		}
	} else totalQuantity = getCartQuantity();

	return (
		<Button
			onClick={toggleCart}
			className='group flex items-center flex-col h-10
                    justify-center pr-1'
			variant='ghost'
			size='icon'
		>
			<div  className='relative bottom-2 h-0 w-0'>
				<Avatar
					className='h-5 w-5 justify-center items-center
					shadow text-green-600 bg-white bg-opacity-90 text-xs
					rounded-md font-semibold'
				>
					{totalQuantity.boxes + totalQuantity.bunches}
				</Avatar>
			</div>
			<ShoppingBag
				strokeWidth='2px'
				className='h-5 w-5 text-primary'
			/>
		</Button>
	);
}

export default Cart;
