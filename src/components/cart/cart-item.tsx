import { Plus, Minus, X } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Suffix} from "@/components/custom-ui/suffix";
import { useCartActions } from "@/hooks/use-cart-actions";
import {type CartItemPlus, type CartItemGuest, Sales} from "@/types/cart";

type Props = {
  item: CartItemPlus | CartItemGuest;
};

export const CartItemCard = ({ item }: Props) => {
  const {cartItem, product, images, colors } = item;
  const urls = images.map((image) => image.url);
  const { removeItem, addToCartHandler, deleteOne } = useCartActions();
  const finalPriceBunches = (product.priceBunch * cartItem.bunches).toFixed(2);
  const finalPriceBoxes = (product.priceBox * cartItem.boxes).toFixed(2);

  return (

        <div className="flex h-40 min-h-[8rem] w-full items-center justify-between bg-transparent space-x-4">
          <Button
            variant='outline'
            size='icon'
            className="w-6 h-6 rounded-none shadow-none flex-shrink-0"
            onClick={() => removeItem(cartItem.id)}
          >
            <X size={12}/>
          </Button>
          <div className="flex h-full items-center">
            <div className="relative h-28 w-28 ">
              <Image
                src={urls[0]!}
                alt={product.genusName}
                className="object-cover"
                fill
                sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
              />
            </div>
          </div>
          <div className="flex w-full flex-col space-y-1">
            <h6 className=" text-sm font-semibold capitalize">{product.genusName} {product.cultivarName}</h6>
            <Separator />
            <div className='flex space-x-2 w-fit h-20 items-center'>
              <div className=" flex flex-col items-end justify-center space-y-0.5">
                <div className="text-xs pr-1 opacity-65">
                  Boxes
                </div>
                <div className='flex items-center w-full justify-between pl-2.5'>
                  <Input
                    readOnly
                    value={cartItem.boxes}
                    type="number"
                    className="w-6 h-6 text-center p-0 rounded-none shadow-none border-none"
                  />
                  <Button
                    variant='ghost'
                    size={'icon'}
                    className="w-6 h-6 shadow-none rounded-sm"
                    onClick={() => deleteOne(cartItem, Sales.Box)}
                    disabled={cartItem.boxes === 0}
                  >
                    <Minus
                      size={12}
                    />
                  </Button>
                  <Button
                    size={'icon'}
                    variant='ghost'
                    disabled={cartItem.boxes === product.boxes}
                    className={`w-6 h-6 rounded-sm shadow-none
                      ${cartItem.boxes === product.boxes ? "opacity-30" : ""}`}
                    aria-label="Increase quantity"
                    onClick={() => addToCartHandler({
                      product,
                      images,
                      colors,
                    }, {
                      boxes: 1,
                      bunches: 0
                    })}
                  >
                    <Plus size={12}/>
                  </Button>
                </div>
                <div className='flex'>
                  <Input
                    readOnly
                    value={finalPriceBoxes}
                    className="relative left-2 pl-2 py-0 rounded-none h-7 w-full"
                  />
                  {Suffix('€')}
                </div>
              </div>
              {/*<Separator orientation='vertical' />*/}
              <div className={`flex flex-col space-y-0.5 items-end justify-center
              ${cartItem.bunches === 0 ? "" : ""}`}>
                <div className="text-xs pr-1 opacity-65">
                  Bunches
                </div>
                <div className='flex items-center w-full justify-between pl-2.5'>
                  <Input
                    readOnly
                    value={cartItem.bunches}
                    type="number"
                    className="w-6 h-6 text-center p-0 shadow-none rounded-none border-none"
                  />
                  <Button
                    variant='ghost'
                    size={'icon'}
                    className="w-6 h-6 rounded-sm shadow-none"
                    onClick={() => deleteOne(cartItem, Sales.Bunch)}
                    disabled={cartItem.bunches === 0}
                  >
                    <Minus
                      size={12}
                    />
                  </Button>
                  <Button
                    size={'icon'}
                    variant='ghost'
                    disabled={cartItem.bunches === product.bunches}
                    className={`w-6 h-6 rounded-sm shadow-none
                ${cartItem.bunches === product.bunches ? "opacity-30" : ""}`}
                    aria-label="Increase quantity"
                    onClick={() => addToCartHandler({
                      product,
                      images,
                      colors,
                    }, {
                      boxes: 0,
                      bunches: 1
                    })}
                  >
                    <Plus size={12}/>
                  </Button>
                </div>
                <div className='flex'>
                  <Input
                    readOnly
                    value={finalPriceBunches}
                    className="relative left-2 pl-2 py-0 rounded-none h-7 w-full"
                  />
                  {Suffix('€')}
                </div>
              </div>
            </div>
          </div>
        </div>

  );
};
