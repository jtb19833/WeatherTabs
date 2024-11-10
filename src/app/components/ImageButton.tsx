import Image from "next/image";
import Link from "next/link";

export default function ImageButton(source:string,link:string){
    return(
        <Link href={link}><Image src={source}></Image></Link>
    )
}