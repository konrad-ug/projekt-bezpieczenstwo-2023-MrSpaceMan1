import { driver } from "../../infrastructure/db_initialisation";
import { ORDER_ITEM } from "../constants";

const updateItem = async (orderItemId: string, amount: number) => {
  const session = driver.session();

  const result = await session.run(
    `MATCH (orderItem:${ORDER_ITEM} {id: "${orderItemId}"}) 
    SET orderItem.amount=${amount}`
  );

  return result.summary.updateStatistics.updates();
};

export default updateItem;
