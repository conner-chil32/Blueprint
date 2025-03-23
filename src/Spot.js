/**
 * Spot file for containing universal variables.
 * 
 * These variables will be publicly available, anything that could compromise
 * privacy or security should not be in here.
 * 
 * INSTRUCTIONS FOR ADDING VARIABLES:
 * Add the variables, labeled, alongside the others in an organized fashion.
 * Only universal variables, and they must not be changed during runtime.
 * 
 * CSS global variables are declared like this:
 * document.documentElement.style.setProperty('--name-here', 'valueToSet');
 * Then go to the relevant css file and add the variable to a :root body, or
 * make one if there isn't one already. Any value you assign to it will be 
 * the default value.
 * Then, when you want to use said variable: var(--name-here);
 */

/* ----- CSS Variables ----- */
// Listen for when the CSS files are instantiated
document.addEventListener('DOMContentLoaded', () =>{
    console.log("Spot file loaded.");

    // Background
    document.documentElement.style.setProperty('--background-color', '#707070');

    // Text
    document.documentElement.style.setProperty('--global-font', 'OpenDyslexic');

    // Buttons
    document.documentElement.style.setProperty('--border-weight', '20px');

    // Color Palette
    document.documentElement.style.setProperty('--lime-green', '#72D360');
    document.documentElement.style.setProperty('--dark-grey', '#282828');
    document.documentElement.style.setProperty('--dark-blue', '#1E4356');
    document.documentElement.style.setProperty('--light-blue', '#099CAC');
});