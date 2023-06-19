import { useParams } from "react-router-dom"

const Final = () => {
    const { number } = useParams()
    return(
        <div className="wrapper-center">
            <h1 className="title no-margin">Your order number is: </h1>
            <h2 className="title no-margin">{number}</h2>
        </div>
    )
}

export default Final