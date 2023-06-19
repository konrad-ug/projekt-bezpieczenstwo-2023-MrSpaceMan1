import "./kiosk.css"
import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context"
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../store";
import { useNavigate } from "react-router-dom";

const Kiosk = () => {
    const auth = useAuth();
    const userId = auth?.user?.profile.sub

    const [categories, setCategories] = useState([])
    const [menu, setMenu] = useState({});
    const [selected, setSelected] = useState("")
    const [orderId, setOrderId] = useState("")
    const [order, setOrder] = useState({});
    const [items, setItems] = useState({});

    const store = useContext(StoreContext);
    const navigation = useNavigate()

    const getAllItems = (menu) => {
        return Object.values(menu)
            .map(category => Object.values(category))
            .flat()
            .reduce((prev, curr) => ({
                ...prev,
                [curr.id]: curr
            }), {})
    }

    const addItem = (item) => {
        if(order[item.id])
            setOrder({
                ...order,
                [item.id]: order[item.id] + 1,
            })
        else
            setOrder({
                ...order,
                [item.id]: 1
            })
    }

    useEffect(() => {
        const token = auth?.user?.access_token;

        axios.get("http://localhost:3000/api/menu", {
            headers: {
                "Authorization": "Bearer " + token 
            }
        })
        .then(res => {
            const categories = Object.keys(res.data);
            const items = getAllItems(res.data)

            store["items"] = items;
            store["categories"] = categories;
            store["menu"] = res.data;

            setCategories(categories);
            setItems(items);
            setMenu(res.data)
        })
        .catch(err => console.error(err))

        if(!orderId)
            axios.post("http://localhost:3000/api/orders", {
                delivery: "TAKEOUT",
                userId
            }, {
                headers: {
                    "Authorization": "Bearer " + token 
                }
            })
            .then(res => {
                setOrderId(res.data.id)
                store.orderId = res.data.id
            })
            .catch(err => {})

    }, [auth.isAuthenticated, auth.isLoading])


    return (
        <div id="kiosk">
            <div className="wrapper complementary span-2">
                <h1 className="title">Categories</h1>
                <ul id="categories">
                    {categories.map((category) => 
                        <li className="category" key={category}>
                            <button className="button" onClick={() => setSelected(category)}>
                                {category}
                            </button>
                        </li>
                    )}
                </ul>
            </div>
            <div className="wrapper">
                <h1 className="title">Items</h1>
                    <ul id="items">
                    {selected && menu[selected].map((item) => 
                        <li className="item" key={item.id}>
                            <h2 className="no-margin">{item.name}</h2>
                            <h3 className="no-margin">{item.price}</h3>
                            <button className="addItem" onClick={() => addItem(item)}>+</button>
                        </li>
                    )}
                </ul>
            </div>
            <ul id="cart-view">
                {Object.keys(order).map(id => (
                    <li key={id} className="cart-view-item">
                        <h1 className="no-margin">{items[id].name}</h1>
                        <h2 className="no-margin">{order[id]}</h2>
                    </li>
                ))}
            </ul>
            <div className="complementary span-2 wrappper">
                <button id="to-cart" className="complementary" onClick={() => {
                    store.order = order
                    navigation("/cart")
                }}>
                    <h1 className="title">Do koszyka</h1>
                    <h1 className="title"> &gt;&gt; </h1>
                </button>     
            </div>
        </div>
    )
}

export default Kiosk