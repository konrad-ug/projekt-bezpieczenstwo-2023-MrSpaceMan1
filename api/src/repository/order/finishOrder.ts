import { driver } from "../../infrastructure/db_initialisation";
import { ORDER, ORDER_ITEM } from "../constants";

const finishOrder = async (orderId: string) => {
  const session = driver.session();
  const isOrderEmpty = (
    await session.run(`
  MATCH (o:${ORDER} {id: "${orderId}"}) 
  OPTIONAL MATCH (o)<--(oi:${ORDER_ITEM}) 
  RETURN size(collect(oi)) = 0 as isOrderEmpty
  `)
  ).records[0].get("isOrderEmpty");

  const query = `MATCH (order:${ORDER} {id: "${orderId}"}) WITH order
  CALL apoc.do.when(order.orderNumber IS NULL, 
  "MERGE (orderNumber:OrderNumber) "+
  "ON CREATE SET orderNumber.index=1 "+
  "ON MATCH SET orderNumber.index=orderNumber.index+1 "+
  "WITH order, orderNumber "+
  "SET order.orderNumber=orderNumber.index "+
  "RETURN order", 
  "", 
  {order:order}) 
  YIELD value 
  RETURN value`;

  const result = await session.run(query);

  return result.summary;
};

export default finishOrder;
