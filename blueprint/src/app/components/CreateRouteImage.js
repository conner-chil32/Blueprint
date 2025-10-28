import Link from "next/link"
import { library } from "./routeDictionaries.js"

/*Aaron Goodlund, 9/6/25

function: CreateImage()
inputs: 
    code: string
update 10/27/25: 	
    'type': string
        "default" will draw a button with the standard nav-button preset
        "set" sill draw a button with whatever className is set to in routeDictionaries.js 
	
outputs:
    next.js button

This function uses premade dictionaries create image buttons to reuse code as much as possible
update 9/10/25: Supports setting image dimensions and alt text to be desplayed if the image cannot load
*/
export default function CreateImage({code = "",type="default"}){
    const path = library[code]

//    console.log("route in separated function is ")
//    console.log(path["href"])

    return(
        <div className = "routingImage">
            <Link href={path.href}><img title = {path.label} src = {path.image} width = {path.width} height = {path.height} alt = {path.alt_text} className={(type === "default") ? 'default' : ((type==='set') ? path.className : type)}></img>
                {path.label} 
            </Link>
        </div> 
    )
}