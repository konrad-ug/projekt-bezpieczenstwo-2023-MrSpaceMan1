import { useContext } from "react"
import { StoreContext } from "../store"
import "./cart.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "react-oidc-context"

const Cart = () => {
    const { order, orderId, items } = useContext(StoreContext)
    const auth = useAuth()
    const navigation = useNavigate()
    console.log(order, orderId, items);
    const addItemRequest = async (id, amount) => 
        await axios.post("http://localhost:3000/api/orders/" + orderId + "/add", {
        itemId: id,
        amount
    }, {
        headers: {
            Authorization: "Bearer " + auth.user.access_token
        }
    })

    const placeOrder = async () => {
        if(!Object.keys(order)) return


        await Promise
            .all(Object.keys(order).map(id => addItemRequest(id, order[id])))
            .then(res => {
                axios.post("http://localhost:3000/api/orders/" + orderId + "/finish", null, {
                    headers: {
                        Authorization: "Bearer " + auth.user.access_token
                    }
                })
            .then(res => {
                console.log(res.data);
                navigation("/final/" + res.data[0].order.properties.orderNumber)
                    })
                }
            )
    }
    

    return (
        <div id="cart">
            <div className="complementary wrapper-center">
                <h1 className="no-margin title">Confirm order</h1>
            </div>
            <div className="wrapper-center half-width">
            {order && Object.keys(order).map(id => (
                <div key={id} className="">
                    <h1>{items[id].name}</h1>
                    <h2>{order[id]}</h2>
                </div>
            ))}
            </div>
            <button className="order_button" onClick={async () => await placeOrder()}> Complete </button>
        </div>
    )
}

export default Cart