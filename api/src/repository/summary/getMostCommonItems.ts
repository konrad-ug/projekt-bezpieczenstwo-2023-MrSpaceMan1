import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";

const getMostCommonItems = async () => {
  const session = driver.session();
  const query = `
  MATCH (o:OrderItem)<--(i:Item) 
  RETURN i.name as name, sum(o.amount) as amount
  ORDER BY name`;

  const result = await session.run(query);

  return recordToNode(result.records, ["name", "amount"]);
};

export default getMostCommonItems;
