import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { ORDER, ORDER_ITEM } from "../constants";

const isOrderEmpty = async (orderId: string) => {
  const session = driver.session();

  const isOrderEmpty = await session.run(`
  MATCH (o:${ORDER} {id: "${orderId}"}) 
  OPTIONAL MATCH (o)<--(oi:${ORDER_ITEM}) 
  RETURN size(collect(oi))=0 as isOrderEmpty
  `);

  return recordToNode(isOrderEmpty.records, ["isOrderEmpty"]);
};

export default isOrderEmpty;
