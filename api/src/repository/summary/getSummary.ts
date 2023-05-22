import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { IN, IS, ITEM, ORDER, ORDER_ITEM } from "../constants";

const getSummary = async (date: string) => {
  const session = driver.session();
  const formated_date = date.slice(0, 7);
  const query = `
  MATCH (order:${ORDER}) 
  WHERE substring(order.date, 0, 7)="${formated_date}" AND order.orderNumber IS NOT NULL
  OPTIONAL MATCH (order)<-[:${IN}]-(orderItem:${ORDER_ITEM})<-[:${IS}]-(item:${ITEM})
  WITH collect(orderItem.amount*item.price) as sums
  RETURN reduce(acc=0, x in sums | acc + x) as sum`;

  console.log(query);

  const result = await session.run(query);

  return recordToNode(result.records, ["sum"]);
};

export default getSummary;
