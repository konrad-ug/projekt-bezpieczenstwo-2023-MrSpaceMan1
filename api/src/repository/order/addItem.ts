import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { IN, IS, ITEM, ORDER, ORDER_ITEM } from "../constants";

const addItem = async (id: string, itemId: string, amount: number) => {
  const session = driver.session();
  const itemExists = (
    await session.run(`
  MATCH (o:${ORDER} {id: "${id}"})<--(oi:${ORDER_ITEM})<--(i:${ITEM} {id: "${itemId}"}) RETURN count(oi) > 0 as itemExists`)
  ).records[0].get("itemExists");

  let result;
  if (itemExists) {
    result = await session.run(`
    MATCH (o:${ORDER} {id: "${id}"})<--(oi:${ORDER_ITEM})<--(i:${ITEM} {id: "${itemId}"}) 
    WITH oi, i
    SET oi.amount = oi.amount + ${amount}
    RETURN oi as orderItem, i as item`);
  } else {
    result = await session.run(`
    MATCH (order:${ORDER} {id: "${id}"}), (item:${ITEM} {id: "${itemId}"}) WITH order, item
    CALL {RETURN apoc.create.uuid() as uuid } WITH uuid, order, item
    CREATE (orderItem:${ORDER_ITEM} {id: uuid, amount: ${amount}}),
    (order)<-[:${IN}]-(orderItem)<-[:${IS}]-(item)
    RETURN *`);
  }


  return recordToNode(result.records, ["orderItem", "item"]);
};

export default addItem;
