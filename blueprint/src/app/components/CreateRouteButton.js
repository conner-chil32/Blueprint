import Link from "next/link"
import { library } from "./routeDictionaries.js"

/*Aaron Goodlund, 9/6/25

function: CreateButton()
inputs: 
    code: string
	
outputs:
    next.js button

This function uses premade dictionaries create buttons to reuse code as much as possible
*/
export default function CreateButton({code = ""}){
    const path = library[code]

//    console.log("route in separated function is ")
//    console.log(path["href"])
    
    return(
        <div className = "routingButton">
            <Link href={path.href} className={path.className}>
                {path.label} 
            </Link>
        </div> 
    )
}