import { driver } from "../../infrastructure/db_initialisation";
import { Delivery, OrderNode } from "../../types";
import { recordToNode } from "../../utils/recordToNode";
import { ORDER, ORDERED_BY, USER } from "../constants";

const createOrder = async (
  delivery: Delivery,
  userId: string
): Promise<Partial<OrderNode>[]> => {
  const session = driver.session();
  const query = `MATCH (user:${USER} {id: "${userId}"}) WITH user
  CALL apoc.do.when(user IS NOT NULL,
  "WITH user, uuid, date " +
  "CREATE (order:${ORDER} {delivery: '${delivery}', id: uuid, date: date}), " +  
  "(order)<-[:${ORDERED_BY}]-(user) " +
  "RETURN order ",
  "",
  {
    user: user,
    uuid: apoc.create.uuid(),
    date: apoc.date.toISO8601(apoc.date.currentTimestamp(), 'ms') 
  }) 
  YIELD value RETURN value as order`;

  const result = await session.run(query);

  return recordToNode(result.records, [
    "order",
  ]) as unknown as Partial<OrderNode>[];
};

export default createOrder;
