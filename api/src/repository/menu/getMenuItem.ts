import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { ITEM } from "../constants";

const getMenuItem = async (id: string) => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (item: ${ITEM} {id: "${id}"}) RETURN item`
  );
  return recordToNode(result.records, ["item"]);
};

export default getMenuItem;
