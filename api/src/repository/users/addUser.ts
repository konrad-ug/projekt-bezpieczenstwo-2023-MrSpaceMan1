import { driver } from "../../infrastructure/db_initialisation";
import { recordToNode } from "../../utils/recordToNode";
import { USER } from "../constants";

const addUser = async (phone: string, isAdmin: boolean) => {
  const session = driver.session();
  const result = await session.run(
    `
    CALL { RETURN apoc.create.uuid() as uuid } WITH uuid
    MERGE (user:${USER}) 
    ON CREATE SET user={phone: '${phone}', isAdmin: '${isAdmin}', id: uuid}
    RETURN user`
  );

  return recordToNode(result.records, ["user"]);
};

export default addUser;
