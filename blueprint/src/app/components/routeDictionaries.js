/*template = {
    label: "", 
    href: "", 
    className: "", 
    image: "", 
        height: 100, 
        width: 100, 
        alt_text: ""
}*/

const features = {
    label: "Features", 
    href: "/features", 
    className: "nav-button", 
}

const pricing = {
    label: "Pricing", 
    href: "/pricing", 
    className: "nav-button"
}

const canvas = {
    label: "Canvas", 
    href: "/canvas", 
    className: "nav-button"
}

const logo = {
//    label: "Logo", //may be desired later, but currently text is larger than icon
    href: "/", 
    className: "logoStyle", 
    image: "images/Blueprint_trans.png",
    alt_text: "Blueprint logo"
}

const login = {
    label: "Login", 
    href: "login", 
    className: "nav-button"
}





const library = {
    features: features,
    pricing: pricing,
    logo: logo,
    login: login,
    canvas: canvas
}
export { library };