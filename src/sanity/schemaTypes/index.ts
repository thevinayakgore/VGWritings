import { type SchemaTypeDefinition } from "sanity";
import about from "./about";
import general from "./general";
import learning from "./learning";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, learning, general],
};
