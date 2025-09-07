'use client'

import { MapPin, Plus } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useDate } from '@/hooks/use-date'
import { useCStore } from '@/context/store-provider'
import { useRouter } from 'next/navigation'

const Location = () => {
  const router = useRouter()
  const { store } = useCStore()
  const date = useDate()
  const isOpen = date.hours > 4 && date.hours < 10
  const isWorking = date.day > 0
  return (
    <HoverCard openDelay={30}>
      <HoverCardTrigger asChild>
        <Button
          className='flex-col h-10'
          variant='ghost'
          size='icon'
        >
          {/* <div className='relative bottom-1 h-0 w-0'>
            {
              isOpen && isWorking ? (
                <CheckCircle2
                  strokeWidth='1.3px'
                  className='h-4 w-4
                    text-white bg-primary rounded-full opacity-90'
                  />
              ) : (
                <CircleSlash
                  strokeWidth='1.3px'
                  className='h-4 w-4 text-white bg-primary opacity-90
                  rounded-full'
                />
              )
            }
          </div> */}
          <MapPin
            strokeWidth='2px'
            className='h-5 w-5 text-primary'
          />
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        className="
          relative
          right-2
          top-1
          w-96
          p-4
          shadow-none
        "
      >
        <div className='flex flex-row gap-x-8 items-center'>

          <div className='tracking-[.01rem]'>
            <p className='text-gray-500 text-xs uppercase'>your store:</p>
            <p className='font-bold text-xl h-6 text-muted-foreground'>Rungis I</p>
            <Button disabled variant='link' className='p-0 h-0'>Change store</Button>
          </div>
        </div>
        <div className='flex flex-row py-4 gap-x-7 pl-1'>
          <div className='text-xs w-28'>
            <p className='text-gray-500 uppercase'>opening hours:</p>
            {
              isOpen && isWorking ? (
                <p className='text-green-500'>Open now</p>
              ) : (
                <p className='text-red-500'>Closed</p>
              )
            }
          </div>
          <div className='tracking-[.01rem]'>
            <p className='text-xs text-gray-500 uppercase'>address:</p>
            <p className='text-sm'>218 Allée des Iris Fleurs 129</p>
            <p className='text-sm uppercase'>94631 rungis cedex</p>
            <p className='uppercase text-xs'>France</p>
          </div>
        </div>
        <div className='flex gap-x-14 pl-1'>
            <Button
              className='rounded uppercase font-semibold'
              onClick={() => router.push(`/stores/${store?.id}/info`)}
            >
              <Plus strokeWidth='2px' className='h-4 w-4'/>
              info
            </Button>
            <Button
              className={`
                ${!store ? 'disabled' : ''}
                uppercase
                rounded
                border-primary
                border-2
                font-semibold
                text-primary
                hover:bg-primary
                hover:text-white
              `}
              variant='outline'
              onClick={() => router.push(`/stores/${store?.id}/stocks`)}
            >
              view stock
            </Button>
        </div>
      </HoverCardContent>

    </HoverCard>
  )
}

export default Location
