import Image from "next/image";
import Link from "next/link";

<<<<<<<< HEAD:src/app/components/ImageButton.tsx
export default function ImageButton(data:any){
========
export default function ImageButton(data){
>>>>>>>> TailWind-Migration:src/app/components/ImageButton.js
    data = data.data
    return(
        <Link href={data.linkTo}><Image src={data.source} alt={data.altText} height={data.ht} width={data.wd}></Image></Link>
    )
}