import { Record as Neo4jRecord } from "neo4j-driver";

export const recordToNode = (recordList: Neo4jRecord[], keys: string[]) => {
  return recordList.map((record) => {
    const nodes: Record<string, object> = {};
    for (const key of keys) {
      nodes[key] = record.get(key);
    }
    return nodes
  });
};
