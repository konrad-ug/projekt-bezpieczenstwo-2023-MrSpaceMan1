import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { ITEM } from "../constants";

const deleteMenuItem = async (id: string, name?: string, price?: number) => {
  const session = driver.session();
  const query = `MATCH (item: ${ITEM} {id: "${id}"}) DETACH DELETE item`;

  const result = await session.run(query);

  return result.summary;
};

export default deleteMenuItem;
