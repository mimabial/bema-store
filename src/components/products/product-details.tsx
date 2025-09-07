import {useState} from 'react';
import { type ProductOA} from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TableCell,
    TableRow
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useCartActions} from "@/hooks/use-cart-actions";
import {useTranslations} from "next-intl";

type Item = {
    data: ProductOA
};

export const ProductDetails = (item: Item) => {
    const {
        priceUnit,
        length,
        origin,
        quality,
      boxes,
      priceBox,
      perBox,
      bunches,
      priceBunch,
      perBunch,
      units,

      genusName,
      cultivarName,
    } = item.data;
    const t = useTranslations('product')
    const rows = [
        {
            name: t('packages'),
            value: boxes
        },
        {
            name: t('content'),
            value: perBox
        },
        {
            name: t('total'),
            value: priceBox
        },
        {
            name: t('length'),
            value: length
        },
        {
            name: t('origin'),
            value: origin
        },
        {
            name: t('quality'),
            value: quality
        }
    ]
    const quantityArray = Array.from({length: item.data.boxes}, (_, i) => i + 1);
    const [quantityState, setQuantity] = useState(1);
    const { addToCartHandler } = useCartActions();
    return (
        <Card className='border-none shadow-none max-w-[35rem]'>
            <CardHeader className='flex flex-col space-y-4'>
                <CardTitle
                    className="text-3xl font-semibold text-primary capitalize"
                >
                    {genusName} {cultivarName}
                </CardTitle>
                <CardDescription className="text-lg font-semibold">${priceUnit.toFixed(2)}</CardDescription>
                <div className='w-full flex space-x-2 py-4'>
                    <Select onValueChange={(value) => setQuantity(Number(value))}>
                        <SelectTrigger className='w-40 h-14 rounded-none'>
                            Quantity:
                            <SelectValue className='text-base' placeholder='1'/>
                        </SelectTrigger>
                        <SelectContent>
                            {quantityArray.map((q, index) => (
                                <SelectItem key={index} value={q.toString()}>
                                    {q}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        className="w-full h-14 font-bold rounded-none "
                        onClick={() => addToCartHandler(item.data, quantityState)}
                        disabled={boxes < 1}
                    >
                        {`${boxes > 0 ? "Add to Cart" : "Out of stock"}`}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='py-2 w-full flex space-x-4'>
                <div className='w-40'/>
                <div className='w-full'>
                    {rows.map((row, index) => (
                        <TableRow key={index} className='even:bg-white hover:even:bg-white odd:bg-neutral-100 hover:odd:bg-neutral-100 border-none px-2 rounded-lg'>
                            <TableCell
                                className='p-2 font-medium text-neutral-500 text-md w-full rounded-lg'
                            >
                                {row.name}
                            </TableCell>
                            <TableCell className='p-2 text-md '>{row.value}</TableCell>
                        </TableRow>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
