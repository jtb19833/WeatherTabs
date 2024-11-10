import ImageButton from "./components/ImageButton";
type logoProps = {
  source:string;
  linkTo:string;
  altText:string;
  ht: number
  wd: number
}
export default function Home() {
  let sentProps = {
    source: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg",
    linkTo: "https://www.nationalgeographic.com/animals/mammals/facts/domestic-cat",
    altText: "Car",
    ht: 500,
    wd: 500
  }
  return(
    <div>
      <ImageButton data= {sentProps}/>
    </div>
  )
}
