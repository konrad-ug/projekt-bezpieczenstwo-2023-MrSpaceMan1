import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { ITEM, MODIFIER, MODIFIES, ORDER, ORDER_ITEM } from "../constants";

const modifyItem = async (itemId: string, text: string) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (order:${ORDER})<--(orderItem:${ORDER_ITEM})<--(item:${ITEM} {id: "${itemId}"}) 
    WITH orderItem 
    CALL apoc.do.when(apoc.node.degree.in(orderItem, "${MODIFIES}")<1,
    "CALL { RETURN apoc.create.uuid() as uuid } " + 
    "WITH orderItem, uuid " +
    "CREATE (modifier:${MODIFIER} {message: '${text}', id: uuid}), " +
    "(modifier)-[:${MODIFIES}]->(orderItem) RETURN *", 
    "MATCH (n)-[:${MODIFIES}]->(orderItem) " +
    "SET n.message=n.message+' ${text}' " +
    "RETURN n", 
    {orderItem:orderItem}) 
    YIELD value RETURN value as modifier`
  );

  return recordToNode(result.records, ["modifier"]);
};

export default modifyItem;
