import CreateButton from "../components/CreateRouteButton.js";
import { library } from "../components/routeDictionaries.js";
import styles from "./page.module.css";
import Navbar from "../components/navbar";  // Import the Navbar component


//a series of buttons that map through routeDirectories.library
//fill the directory with every page we have

//url are in src/app/<folder>
    //folder is equivalent of <url>/<folder name>

export default function NavPage(){
    //there isn't a dictionary.map function
    return (
        <div className = {styles.table}>
        <Navbar />
            {Object.entries(library).map(([key,value]) => (
                <div key={key} className = {styles.cell}>
                    <CreateButton code = {key} />
                </div>
            ))}
        </div>
    )
}