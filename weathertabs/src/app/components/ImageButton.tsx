import Image from "next/image";
import Link from "next/link";
type logoProps = {
    source:string;
    linkTo:string;
    altText:string;
    ht: number
    wd: number
  }
export default function ImageButton(data:any){
    data = data.data
    return(
        <Link href={data.linkTo}><Image src={data.source} alt={data.altText} height={data.ht} width={data.wd}></Image></Link>
    )
}