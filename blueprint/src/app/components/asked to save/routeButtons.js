import Link from "next/link"

/*

abstract class: RouteButton
inputs:
    label: string of what will be written on the button
    route: string of what route the href will take
    buttonStyle: string name of the button's className
    image: optional string to an image location

This class is intended as framework for more button classes to be built from

*/
//look up html a-tag and/or Next.js Link tag
//next.js doesn't like classes
export default class RouteButton{

    label = "generic"
    route = "/"
    buttonStyle = "nav-button"
    image = ""

/* STRING INPUT VERSION */
    constructor(label = "", route = "/", buttonStyle = "", image= "images\Blueprint_trans.png"){
        if(this.constructor == RouteButton){
            throw new Error("The RouteButton Class is Abstract")
        }
        
        this.label = label
        this.route = route
        this.buttonStyle = buttonStyle
        this.image = image

        console.log("route in super constructor is ")
        console.log(this.route)
    }
    getValues(){
        return {"label": this.label, "route": this.route, "buttonStyle": this.buttonStyle, "image": this.image}
    }
}

/*

function: CreateButton()
inputs: 
    none
	
outputs:
    html

This function is designed so implementations of it can make routing buttons

*/
/*    CreateButton(){
//this.route doesn't connect to the class's this.route in memory
        console.log("route in function is ")
        console.log(this.route)
        return(
            <div className = "routingButton">
                <Link href={this.route} className={this.buttonStyle}>
                    {this.label} 
                </Link>
            </div> 
        )
    }

/* Aaron Goodlund 9/_/2025

function: CreateImage()
inputs: 
    none
	
outputs:
    html

This function is designed so implementations of it can make routing buttons out of images

*/
/*    CreateImage(){
        return(
            <div className = "routingImage">
                <Link href={this.route}>
                    <img title = {this.label} src = {this.image} className={this.buttonStyle}></img>
                </Link>
            </div>
        ) 
    }
}
    */
/*
export default class FeaturesButton extends RouteButton{
    constructor(){
        super("Features (test)", "/features", "nav-button")
    }
}
*/

/* each goes in own file with " import RouteButton from "./routeButtons.js" "
export default class PricesButton extends RouteButton{
    constructor(){
        super("Prices (test)", "/Pricing", "nav-button")
    }
}

export default class LoginButton extends RouteButton{
    constructor(){
        super("Login(test)", "/login", "nav-button")
    }
}

export default class HomeButton extends RouteButton{
    constructor(){
        super("Logo", "/", "logoStyle", "blueprint\public\images\Blueprint_trans.png")
    }
}
    */