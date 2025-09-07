import Image from 'next/image';
import Link from 'next/link';

type LinksProps = {
    href: string;
    src: string | null;
}

export default function userLink({href, src} : LinksProps) {
            return <Link passHref href={href}>
                {
                    src && <Image alt='profile' src={src} width={400} height={400}/>
                }
            </Link>;
}