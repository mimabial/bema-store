import Link from "next/link"


export const LegalLinks = ({string}: {string:string}) => {
    return (
        <div className="text-xs leading-4">
            By {string}, you agree to Bema&apos;s &nbsp;
            <Link 
                href='/public'
                className="text-blue-500 hover:underline"
            >
                general terms and conditions of sale
            </Link>
            . See our &nbsp;
            <Link
                href='/public'
                className="text-blue-500 hover:underline"
            >
                privacy statement
            </Link>
            , our &nbsp;
            <Link
                href='/public'
                className="text-blue-500 hover:underline"
            >
                cookie policy
            </Link>
            &nbsp; and our &nbsp;
             <Link
                href='/public'
                className="text-blue-500 hover:underline"
            >
                interest-based advertising policy
            </Link>
             
             .
        </div>
    )
}