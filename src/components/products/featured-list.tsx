import { useEffect, useRef, useState } from "react";

import { ProductCard } from "./product-card";
import { ArrowLeft, ArrowRight } from '@/components/icons'
import {type ProductExt} from "@/types/product";

interface Ref extends HTMLDivElement {
  offsetWidth: number;
  scrollLeft: number;
  scrollWidth: number;
}

export const FeaturedList = ({
  items,
}: {
  items: ProductExt[] | undefined;
}) => {
  const carousel = useRef<Ref>(null);
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, [items]);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: string) => {
    if (direction === "prev") {
      return currentIndex <= 0;
    }

    if (
      direction === "next" &&
      carousel.current !== null &&
      currentIndex !== 0
    ) {
      return (
        carousel.current.offsetWidth * currentIndex + 400 >=
        maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel?.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  return (
    <div className=" flex flex-col gap-3">
      <div className="relative">
        <div className="absolute hidden h-full w-full items-center justify-between md:flex">
          <button
            onClick={movePrev}
            aria-label="Previous Page"
            className="group relative z-10 h-10 w-10 rounded-full bg-white shadow-sm p-2 transition-all duration-300 hover:bg-primary hover:shadow-none disabled:opacity-0"
            disabled={isDisabled("prev")}
          >
            <ArrowLeft className="transition-all duration-300 hover:text-white group-hover:text-white" />
          </button>
          <button
            onClick={moveNext}
            aria-label="Next Pag  e"
            className="group relative z-10 h-10 w-10 rounded-full bg-white shadow-sm p-2 transition-all duration-300 hover:bg-primary hover:shadow-none disabled:opacity-0"
            disabled={isDisabled("next")}
          >
            <ArrowRight strokeWidth={2.5} className="transition-all duration-300 hover:text-white group-hover:text-white" />
          </button>
        </div>
        <div
          className=" relative flex touch-pan-x snap-x snap-mandatory justify-between gap-4 overflow-x-auto scroll-smooth md:overflow-x-hidden  "
          ref={carousel}
        >
          {items?.map((el) => (
            <ProductCard product={el} key={el.product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
