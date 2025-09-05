import Link from "next/link"
//import RouteButton from "./routeButtons.js"

//receive a RouteButtons object
function CreateButton(path){
    console.log("route in separated function is ")
    console.log(path["route"])
    
    return(
        <div className = "routingButton">
            <Link href={path.route} className={path.buttonStyle}>
                {path.label} 
            </Link>
        </div> 
    )
}

export default CreateButton;