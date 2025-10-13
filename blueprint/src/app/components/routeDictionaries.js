/*template = {
    label: "", 
    href: "", 
    image: "", 
        height: 100, 
        width: 100, 
        alt_text: ""
}*/

const features = {
    label: "features", 
    href: "/features", 
    className: "nav-button",    //className included for the nav bar
}

const pricing = {
    label: "pricing", 
    href: "/pricing", 
    className: "nav-button"     //className included for the nav bar
}

const logo = {
//    label: "Logo", //may be desired later, but currently text is larger than icon
    href: "/", 
    className: "logoStyle",     //className included for the nav bar
    image: "images/Blueprint_trans.png",
    alt_text: "Blueprint logo"
}

const login = {
    label: "login", 
    href: "/login", 
    className: "nav-button"     //className included for the nav bar
}

const admin_account_view = {
    label: "admin_account_view",
    href: "/admin-account-view", 
    className: "nav-button" 
}

const admin_page = {
    label: "admin_page",
    href: "/admin-page", 
    className: "nav-button" 
}

const canvas = {
    label: "canvas",
    href: "/canvas", 
    className: "nav-button" 
}

const ftu_main = {
    label: "ftu_main",
    href: "/ftu-main", 
    className: "nav-button" 
}

const portal = {
    label: "portal",
    href: "/portal", 
    className: "nav-button" 
}

const recovery = {
    label: "recovery",
    href: "/recovery", 
    className: "nav-button" 
}

const signup = {
    label: "signup",
    href: "/signup", 
    className: "nav-button" 
}

const userwebbackend = {
    label: "userwebbackend",
    href: "/userwebbackend", 
    className: "nav-button" 
}

const wordpress_CRUD = {
    label: "wordpress_CRUD",
    href: "/WordpressCRUD", 
    className: "nav-button" 
}

const wordpress_test = {
    label: "wordpress_test",
    href: "/WordpressTest", 
    className: "nav-button" 
}

const payment = {
    label: "buy now",
    href: "/payment",
    className: "nav-button"
}



const navtest = {
    label: "navtest",
    href: "/navtest",
    className: "nav-button"
}

const library = {
    features: features,
    pricing: pricing,
    logo: logo,
    login: login,
    
    admin_account_view: admin_account_view,
    admin_page:admin_page,
    canvas:canvas,
    ftu_main:ftu_main,
    portal:portal,
    recovery:recovery,
    signup:signup,
    userwebbackend:userwebbackend,
    payment:payment,

    navtest:navtest
}
export { library };
