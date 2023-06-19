import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { CATEGORY } from "../constants";

const addMenuCategory = async (category: string) => {
  const session = driver.session();
  const query = `
  CALL { RETURN apoc.create.uuid() as uuid }
  WITH uuid
  MERGE (c:${CATEGORY} {name: "${category}"})
  ON CREATE SET c.id = uuid
  RETURN c as category`;

  const result = await session.run(query);

  return recordToNode(result.records, ["category"]);
};

export default addMenuCategory;
