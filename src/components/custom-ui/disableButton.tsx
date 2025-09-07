'use client'

import {Button, type buttonVariants} from "@/components/ui/button";
import {PencilLine, PencilOff } from "lucide-react";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const DisableButton = ({disabled, ...props}: ButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
      <Button
        type="button"
        variant='outline'
        size='icon'
        className={'relative hover:cursor-pointer h-6 w-6 p-1'}
        onClick={props.onClick}
      >
        <PencilLine className={`absolute h-3 w-3 transition-opacity ease-in-out duration-300 ${disabled ? '' : 'opacity-0'}`}/>
        <PencilOff className={`absolute h-3 w-3 transition-opacity ease-in-out duration-300 ${disabled ? 'opacity-0' : ''}`}/>
      </Button>
        </TooltipTrigger>
      <TooltipContent>
        {
          disabled ?
            <p>Enable input.</p>
            :
            <p>Disable input.</p>
        }
      </TooltipContent>
    </Tooltip>
  );
};

import type {VariantProps} from "class-variance-authority";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
