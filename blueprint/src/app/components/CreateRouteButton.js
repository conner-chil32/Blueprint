import Link from "next/link"
import { library } from "./routeDictionaries.js"

/*Aaron Goodlund, 9/6/25

function: CreateButton()
inputs: 
    'code': string
update 10/27/25: 	
    'type': string
        "default" will draw a button with the standard nav-button preset
        "set" sill draw a button with whatever className is set to in routeDictionaries.js 

outputs:
    next.js button

This function uses premade dictionaries create buttons to reuse code as much as possible

*/
export default function CreateButton({code = "",type="default"}){
    const path = library[code]

//    console.log("route in separated function is ")
//    console.log(path["href"])
    
    return(
        <div className = "capitalize">
            <Link href={(path === undefined) ? "/" : path.href} className={(type === "default") ? 'nav-button' : ((type==='set') ? path.className : type)}>
                {(path === undefined) ? "Bad_Code_Default" : path.label} 
            </Link>
        </div> 
    )
}