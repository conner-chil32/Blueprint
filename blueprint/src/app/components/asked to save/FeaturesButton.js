import RouteButton from "./routeButtons.js"

export default class FeaturesButton extends RouteButton{
    constructor(){
//        super({"label": "Features(test)", "route": "/features", "buttonStyle": "nav-button"})
        super("Features", "/features", "nav-button")
        
        console.log("route in constructor is")
        console.log(this.route)
    }
}

/*
utilization:

export default function Navbar() {
    const featuresRoute = new FeaturesButton() 
        ...
    <CreateButton path={featuresRoute.getValues()} />

*/