import Link from "next/link"
import { library } from "./routeDictionaries.js"

/*Aaron Goodlund, 9/6/25

function: CreateImage()
inputs: 
    code: string
	
outputs:
    next.js button

This function uses premade dictionaries create image buttons to reuse code as much as possible
does not currently support setting image dimensions or alt text
*/
export default function CreateImage({code = ""}){
    const path = library[code]

//    console.log("route in separated function is ")
//    console.log(path["href"])

    return(
        <div className = "routingImage">
            <Link href={path.href} src={path.image} className={path.className}>
            </Link>
        </div> 
    )
}