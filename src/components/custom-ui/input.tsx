import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  _prefix?: React.ReactNode;
  _suffix?: React.ReactNode;
  _type?: Type;
}

export enum Type {
  Integer = "integer",
  Float = "float",
}

type Value = string | number | readonly string[] | undefined;

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, _type?: Type, value?: Value) => {
  if (_type) {
    if (event.key === '+'
      || event.key === '-'
      || event.key === 'e'
    ) event.preventDefault()
    if (_type === Type.Integer) {
      if (event.key === '.'
        || event.key === ','
      ) event.preventDefault()
      if (typeof value === "number") {
        if (event.key === '0') event.preventDefault()
      } else if (typeof value === "string") {
        if (event.key === '0' && value.length === 0) event.preventDefault()
      }
    } else if (_type === Type.Float) {
      if (event.key === '0' && typeof value === "string" && value.length === 1) {
        event.preventDefault()
      }
    }
  }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ _type, _prefix, _suffix, className,
     type, value, ...props },
   ref) => {
    return (
      <div className="w-full relative">
        {_prefix && (
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
            {_prefix}
          </div>
        )}
        <input
          onFocus={(event) => event.target.select()}
          onKeyDown={(event) => handleKeyDown(event, _type, value)}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 px-4 text-sm " +
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium " +
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 " +
            "focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            _prefix ? "pl-8" : "",
            _suffix ? "pr-8" : "",
            className

          )}
          ref={ref}
          {...props}
          value={value}
        />
        {_suffix && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 
          ${typeof _suffix === 'string' ? 'text-muted-foreground uppercase font-medium opacity-50 text-sm' : ''}`}>
            {_suffix}
          </div>
        )}
      </div>
    );
  }
)
Input.displayName = "Input"

export {Input}
