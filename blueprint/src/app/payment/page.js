import styles from "../pricing/page.module.css";
import payStyles from "./page.module.css";
import Navbar from "../components/navbar";
import { planTypes } from "../pricing/planTypes.js";

/*
https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API/Using_the_Payment_Request_API
https://developers.google.com/standard-payments/codelabs/nodejs-connectivity-codelab#0
https://medium.com/@chodvadiyasaurabh/building-a-payment-gateway-with-node-js-and-stripe-a-step-by-step-guide-fa097a743bf2
*/

/*
function validateURL(dest){
    try {
        const url = new URL(dest);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
  }
}
*/

function routeProcessPayment(paymentProcessLocation = "payment", api){
    // Define a route for processing payments
    app.post('/'+paymentProcessLocation, async (req, res) => {
    const { amount, currency, token } = req.body;

    try {
        // Create a payment intent using the API
        const paymentIntent = await api.paymentIntents.create({
        amount,
        currency,
        payment_method: token,
        confirm: true,
        });

        // Return the payment intent status to the client
        res.json({ status: paymentIntent.status });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
    });
}

export default function Payment(){
    const dest = "/login"; //the destination of the link with a query for the plan's type
                                // ".../<dest>?plan=<plan name>"

//    let url = require('url');

//  let address = '<url>';
//  let <testing object> = url.parse(address, true);
        //then all of the 'url' below are instead <testing object>

//    validateURL(url.href);

//    console.log(url.href, url.host, url.pathname, url.search);

    return(
        <>
            <Navbar />
            <div className={styles.body}>
                <div className={styles.mainContent}>
                    <div className={styles.plans}>
                        <div className = {styles.planCard}>
                            
                            <form action={dest}>
                            <label className="capitalize" htmlFor="plans">choose a plan</label>
                            <select id="plans" name="plan" className="capitalize">
                                {
                                    planTypes.map((card, index) => (
                                        <option value={card.name} key={card.id}>{card.name}</option>
                                    ))
                                }
                            </select>
                            
                            <br></br><br></br>
                            <input className="capitalize" type="submit" value="pay now"/>
                            </form>

            </div></div></div></div>
        </>
    );
}
