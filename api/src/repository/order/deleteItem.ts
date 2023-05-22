import { driver } from "../../infrastructure/db_initialisation";
import { MODIFIER, ORDER_ITEM } from "../constants";

const deleteItem = async (orderItemId: string) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (orderItem:${ORDER_ITEM} {id: "${orderItemId}"}) 
    OPTIONAL MATCH (modifier:${MODIFIER})-->(orderItem)
    DETACH DELETE orderItem, modifier`
  );

  return result;
};

export default deleteItem;
