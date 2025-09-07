import Image from "next/image";
import {Blocks, PencilRuler, ShoppingBag, Minus, Plus} from "@/components/icons";
import { useState } from "react";
import Link from "next/link";

import { useCartActions } from "@/hooks/use-cart-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Quantity } from "@/types/cart";
import { Paths } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {type ProductExt} from "@/types/product";

type Props = {
  product: ProductExt;
};

export const ProductCard = ({ product }: Props) => {

  const {
    images,
    colors,
    product: baseProduct
  } = product;

  const {
    id,
    genusName,
    cultivarName,
    length,
    boxes,
    bunches,
    priceBox,
    priceBunch,
    perBox,
    perBunch,
  } = baseProduct;

  const is9xl = useMediaQuery("(min-width: 1536px)")
  const is8xl = useMediaQuery("(min-width: 1366px)")
  const is7xl = useMediaQuery("(min-width: 1280px)")
  const is6xl = useMediaQuery("(min-width: 1152px)")
  const is5xl = useMediaQuery("(min-width: 1024px)")
  const is4xl = useMediaQuery("(min-width: 896px)")
  const is3xl = useMediaQuery("(min-width: 768px)")
  const is2xl = useMediaQuery("(min-width: 672px)")

  const {
    addToCartHandler,
    getBoxesInCart,
    getBunchesInCart,
    getAvailableBoxes,
    getAvailableBunches,
    getIsBoxesDisabled,
    getIsBunchesDisabled
  } = useCartActions();

  const [quantity, setQuantity] = useState<Quantity>({
    boxes: 0,
    bunches: 0,
  });

  const url = images[0]?.url
  const availableBoxes = getAvailableBoxes(baseProduct);
  const availableBunches = getAvailableBunches(baseProduct);

  return (
    <Card className="group min-w-72 shadow-none border-none rounded-sm">
      <CardHeader className='space-y-2 p-4'>
        <CardTitle className="capitalize w-fit relative">
          {genusName} {cultivarName}
          {/*<Separator className={bunches > -1 ? 'absolute border-[1.5px] border-primary -bottom-1 left-0 w-0 transition-all opacity-0 group-hover:opacity-100 group-hover:w-full duration-300' : 'hidden'} />*/}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground flex items-center space-x-4">
          <div className='color-info w-fit space-x-1.5 flex items-center'>
            <div className=" w-[14px] h-[14px] rounded-sm"
              style={{
                backgroundImage: `radial-gradient(closest-side, ${colors.map(el => el.value).join(', ')})`,
              }}
            />
            <span className='capitalize'>{colors.map(el => el.name).join(' ')}</span>
          </div>
          <div className='size-info w-fit space-x-1 flex items-center'>
            <PencilRuler size={14} />
            <span>{length} cm</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className='p-4 pt-0'>
        <div className="relative h-64 w-full overflow-hidden rounded-sm ring ring-muted">
          <Link className='hover:cursor-pointer' href={`${Paths.Products}/${id}`}>
            {
              url && <Image
              src={url}
              alt="product image"
              fill
              className="object-cover rounded group-hover:scale-110 transition-transform duration-300"
            />}
          </Link>
        </div>
      </CardFooter>
      <CardContent className="space-y-1.5 rounded-sm p-4 pt-0">
        <div
          className={`${boxes > 0 ? 'capitalize text-xs flex space-x-2' : 'hidden'}`}>
          <div className='flex justify-between w-full'>
            <div className='first-third-boxes flex space-x-2 min-w-24'>
              <div id='stems-per-box' className='flex flex-col flex-shrink-0'>
              <div className='font-semibold border-b w-fit'>
                  {perBox} stems &nbsp;
                </div>
                <div className="text-muted-foreground font-medium">
                  box
                </div>
              </div>
              <div id='price-in-box' className='flex flex-col flex-shrink-0'>
                <div className='font-semibold border-b w-fit'>
                  {priceBox} €
                </div>
                <div className="text-muted-foreground font-medium">
                  Box
                </div>
              </div>
            </div>
            <div className={`second-third-boxes flex space-x-2 
            ${is6xl && !is8xl ? 'hidden' : ''}
            ${is3xl || !is2xl ? '' : 'hidden'}`}>
              <div className={`flex items-center border rounded-sm h-8 p-0.5
              ${is5xl && !is6xl ? 'hidden' : ''}
              ${is7xl && !is9xl ? 'hidden' : ''}
              ${is2xl && !is4xl ? 'hidden' : ''}`}>
                <Button variant='outline' size='icon' className='w-6 h-6 rounded-sm
                shadow-none'>
                  <Blocks strokeWidth={1.5} size={13}/>
                </Button>
                <Input readOnly className='font-semibold w-6 h-6 p-0 text-center
                border-none shadow-none' value={getAvailableBoxes(baseProduct)}/>
              </div>
              <div className='flex items-center border rounded-sm h-8 p-0.5'>
                <Button size='icon' variant='outline' className='w-6 h-6 rounded-sm
                shadow-none'>
                  <ShoppingBag strokeWidth={1.5} size={13}/>
                </Button>
                <Input readOnly className='font-semibold w-6 h-6 p-0 text-center
                border-none shadow-none' value={getBoxesInCart(baseProduct)}/>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 h-8 ">
            <div
              className='add-remove-wrapper h-8 flex border items-center
              justify-center rounded-sm'
            >
              <Button
                variant='ghost'
                disabled={quantity.boxes < 1}
                className='h-full w-[30px] shadow-none rounded-l-md rounded-r-none'
                size='icon'
                onClick={() => {
                  if (quantity.boxes > 0) {
                    setQuantity((prev) => ({
                      boxes: prev.boxes - 1,
                      bunches: prev.bunches
                    }))
                  }
                }}
              >
                <Minus strokeWidth={3} size={12}/>
              </Button>
              <Input
                readOnly
                className='border-none shadow-none font-semibold h-full w-[30px]
                p-0 text-center rounded-none focus:border-none'
                value={quantity.boxes}/>
              <Button
                variant='ghost'
                className='h-full w-[30px] shadow-none rounded-r-md rounded-l-none'
                size='icon'
                disabled={getIsBoxesDisabled(baseProduct, quantity)}
                onClick={() => {
                  if (quantity.boxes < availableBoxes) {
                    setQuantity((prev) => ({
                      boxes: prev.boxes + 1,
                      bunches: prev.bunches
                    }))
                  }
                }}
              >
                <Plus strokeWidth={3} size={12}/>
              </Button>
            </div>
            <Button
              size='icon'
              variant={'outline'}
              disabled={getIsBoxesDisabled(baseProduct, quantity) && quantity.boxes < 1}
              onClick={() => {
                addToCartHandler({
                  product: baseProduct,
                  colors,
                  images,
                }, quantity)
                setQuantity((prev) => ({
                  boxes: 0,
                  bunches: prev.bunches
                }))
              }}
              className='h-8 w-fit p-0 px-2 font-medium
              rounded-sm shadow-none'
            >
              <ShoppingBag className='relative -right-2.5 -bottom-0.5 text-stone-700' size={16} strokeWidth={2}/>
              <Plus className="z-10 rounded-[3px] border shadow-inner p-0.5 relative -top-1 -left-1
              bg-white bg-opacity-90" size={16} strokeWidth={2}/>
            </Button>
          </div>
        </div>
        <Separator className={bunches > 0 && boxes > 0 ? '' : 'hidden'}/>
        <div
          className={`${bunches > 0 ? 'capitalize text-xs flex space-x-2' : 'hidden'}`}>
          <div className='flex justify-between w-full'>
            <div className='first-third-boxes flex space-x-2 min-w-24'>
              <div id='stems-per-bunch' className='flex flex-col flex-shrink-0'>
                <div className='font-semibold border-b w-fit'>
                  {perBunch} stems &nbsp;
                </div>
                <div className="text-muted-foreground font-medium">
                  bunch
                </div>
              </div>
              <div id='price-in-bunch' className='flex flex-col flex-shrink-0'>
                <div className='font-semibold border-b w-fit'>
                  {priceBunch} €
                </div>
                <div className="text-muted-foreground font-medium">
                  Bunch
                </div>
              </div>
            </div>
            <div className={`second-third-bunches flex space-x-2 
            ${is6xl && !is8xl ? 'hidden' : ''}
            ${is3xl || !is2xl ? '' : 'hidden'}`}>
              <div className={`flex items-center border rounded-sm h-8 p-0.5
              ${is5xl && !is6xl ? 'hidden' : ''}
              ${is7xl && !is9xl ? 'hidden' : ''}
              ${is2xl && !is4xl ? 'hidden' : ''}`}>
                <Button variant='outline' size='icon' className='w-6 h-6 rounded-sm
              shadow-none'>
                  <Blocks strokeWidth={1.5} size={13}/>
                </Button>
                <Input readOnly className='font-semibold w-6 h-6 p-0
              text-center border-none shadow-none' value={availableBunches}/>
              </div>
              <div className='flex items-center border rounded-sm h-8 p-0.5'>
                <Button size='icon' variant='outline' className='w-6 h-6
              rounded-sm shadow-none'>
                  <ShoppingBag strokeWidth={1.5} size={13}/>
                </Button>
                <Input readOnly className='font-semibold w-6 h-6 p-0 text-center
              border-none shadow-none' value={getBunchesInCart(baseProduct)}/>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 h-8">
            <div
              className='add-remove-wrapper h-8 flex border items-center
              justify-center rounded-sm'>
              <Button
                variant='ghost'
                disabled={quantity.bunches < 1}
                className='h-full w-[30px] shadow-none rounded-l-md rounded-r-none'
                size='icon'
                onClick={() => {
                  if (quantity.bunches > 0) {
                    setQuantity((prev) => ({
                      boxes: prev.boxes,
                      bunches: prev.bunches - 1
                    }))
                  }
                }}><Minus strokeWidth={3} size={12}/></Button>
              <Input
                readOnly
                className='border-none shadow-none font-semibold h-full w-[30px]
                p-0 text-center rounded-none focus:border-none'
                value={quantity.bunches}/>
              <Button
                variant='ghost'
                className='h-full w-[30px] shadow-none rounded-r-md rounded-l-none'
                size='icon'
                disabled={getIsBunchesDisabled(baseProduct, quantity)}
                onClick={() => {
                  if (quantity.bunches < availableBunches) {
                    setQuantity((prev) => ({
                      boxes: prev.boxes,
                      bunches: prev.bunches + 1
                    }))
                  }
                }}><Plus strokeWidth={3} size={12}/></Button>
            </div>
            <Button
              size='icon'
              variant={'outline'}
              disabled={getIsBunchesDisabled(baseProduct, quantity) && quantity.bunches < 1}
              onClick={() => {
                addToCartHandler({
                  product: baseProduct,
                  colors,
                  images,
                }, quantity)
                setQuantity((prev) => ({
                  boxes: prev.boxes,
                  bunches: 0
                }))
              }}
              className='h-8 w-fit p-0 px-2 font-medium
                  rounded-sm shadow-none'>
              <ShoppingBag className='relative -right-1 -bottom-0.5 text-stone-700' size={16} strokeWidth={2}/>
              <Plus className="z-10 rounded-[3px] border shadow-inner p-0.5 relative -top-1 -left-1
              bg-white bg-opacity-90" size={16} strokeWidth={2}/>
            </Button>
          </div>
        </div>
      </CardContent>

    </Card>
  );
};

