import Image from "next/image";
import Link from "next/link";

export default function ImageButton(data){
    data = data.data
    return(
        <Link href={data.linkTo}><Image src={data.source} alt={data.altText} height={data.ht} width={data.wd}></Image></Link>
    )
}