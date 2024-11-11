import Image from "next/image";
import Link from "next/link";

export default function ImageLink(data:any){
    data = data.data
    return(
        <div className= "inline-block" >
            <Link href={data.linkTo}>
                <Image src={data.source} alt={data.altText} height={data.ht} width={data.wd}/>
            </Link>
        </div>
    )
}