import { driver } from "../../infrastructure/db_initialisation";
import { MODIFIER, ORDER, ORDER_ITEM } from "../constants";

const deleteOrder = async (orderId: string) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (order:${ORDER} {id: "${orderId}"}) 
    OPTIONAL MATCH (orderItem:${ORDER_ITEM})-->(order) 
    OPTIONAL MATCH (modifier:${MODIFIER})-->(orderItem)
    DETACH DELETE order, orderItem, modifier`
  );

  return result.summary;
};

export default deleteOrder;
