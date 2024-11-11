import Image from "next/image";

export default function ImageButton(data:any){
    data = data.data
    return(
        <Image className = "inline-block pointer-events-auto" src={data.source} alt={data.altText} height={data.ht} width={data.wd} onClick={data.clickHandler}/>
    )
}