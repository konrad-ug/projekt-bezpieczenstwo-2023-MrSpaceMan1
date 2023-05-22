import { driver } from "../../infrastructure/db_initialisation";
import { OrderNode } from "../../types";
import { recordToNode } from "../../utils/recordToNode";
import { IN, IS, ITEM, ORDER, ORDER_ITEM } from "../constants";

const getOrder = async (orderId: string): Promise<OrderNode[]> => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (order: ${ORDER} {id: "${orderId}"})
    OPTIONAL MATCH (order)<-[:${IN}]-(orderItem:${ORDER_ITEM})
    OPTIONAL MATCH (orderItem)<-[:${IS}]-(item:${ITEM}) 
    RETURN order, orderItem, item`
  );

  return recordToNode(result.records, [
    "order",
    "item",
    "orderItem",
  ]) as unknown as OrderNode[];
};

export default getOrder;
