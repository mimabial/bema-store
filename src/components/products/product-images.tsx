import Image from "next/image";
import clsx from "clsx";
import {useState} from "react";
import {type ProductOA} from "@/types";


type Props = {
    images: ProductOA['images'],
    name: string,
}

export const ProductImages = ({images, name}: Props) => {
    const urls = images.map(image => image.file.url);
    const [currentImage, setCurrentImage] = useState(urls[0]);
    return (
        <div className="flex flex-col w-full">
            <div
                className="
                        inset-0
                        min-w-96
                        min-h-full
                        overflow-hidden
                        transition
                        hover:cursor-pointer
                        "
            >
                <div className="relative block h-full">
                    {urls.map(url => (
                        <Image
                            key={url}
                            src={url}
                            alt={`${name} image`}
                            className={clsx('absolute w-full h-full ' +
                                ' duration-700 object-cover', {
                                'opacity-100': currentImage === url,
                                'opacity-0': currentImage !== url,
                            })}
                            fill
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-2 px-2 relative bottom-[5.5rem] z-50">
                {urls.map((url, index) => (
                    <button
                        key={index}
                        className={
                        currentImage === url ? 'h-20 overflow-hidden ring-1 ring-black' : '' +
                            `h-20 
                            w-20
                            overflow-hidden
                            opacity-55
                            hover:opacity-100
                            `}

                        onClick={() => setCurrentImage(url)}
                    >
                        <Image
                            src={url}
                            alt={`${name} image ${index + 1}`}
                            className="object-cover"
                            width={80}
                            height={80}
                        />
                    </button>
                ))}
            </div>

        </div>
    )
}
