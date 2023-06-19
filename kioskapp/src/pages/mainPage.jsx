import { useAuth } from "react-oidc-context"
import "./mainPage.css"
const MainPage = () => {
    const auth = useAuth()
    
    const redirect_url = 
    `http://${window.location.host}/kiosk`

    return <div className="wrapper-center">
        <h1 id="order_title">Złóż zamówienie</h1>
        <button className="order_button" onClick={() => auth.signinRedirect({redirect_uri: redirect_url})}>Zaloguj się</button>
        <img className="icon" src="https://www.svgrepo.com/show/43115/burger.svg" alt="burger" />
    </div>
}

export default MainPage