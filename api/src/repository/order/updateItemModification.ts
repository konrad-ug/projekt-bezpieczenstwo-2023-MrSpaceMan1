import { driver } from "../../infrastructure/db_initialisation";
import { MODIFIER, ORDER_ITEM } from "../constants";

const updateItemModification = async (orderItemId: string, text: string) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (orderItem:${ORDER_ITEM} {id: "${orderItemId}"})<--(modifier:${MODIFIER})
    SET modifier.text=${text}`
  );

  return result.summary;
};

export default updateItemModification;
