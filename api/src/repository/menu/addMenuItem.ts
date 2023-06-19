import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { CATEGORY, IN, ITEM } from "../constants";

const addMenuItem = async (name: string, price: number, category: string) => {
  const session = driver.session();
  const query = `
  MATCH (c: ${CATEGORY} {name: "${category}"}) 
  WITH c
  CALL { RETURN apoc.create.uuid() as uuid }
  WITH c, uuid
  MERGE (i:${ITEM} {name: "${name}", price: ${price}})-[:${IN}]->(c)
  ON CREATE SET i.id = uuid
  RETURN i as item`;

  const result = await session.run(query);
  console.log(result);

  return recordToNode(result.records, ["item"]);
};

export default addMenuItem;
