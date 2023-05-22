import { driver } from "../../infrastructure/db_initialisation";
import { Menu } from "../../types";
import { recordToNode } from "../../utils/recordToNode";
import { CATEGORY, IN, ITEM, MENU } from "../constants";

const getMenu = async (): Promise<Menu> => {
  const session = driver.session();
  const result = await session.run(
    `MATCH (:${MENU})<-[:${IN}]-(category:${CATEGORY})<-[:${IN}]-(item: ${ITEM}) RETURN category, item`
  );
  return recordToNode(result.records, ["category", "item"]) as unknown as Menu;
};

export default getMenu;
