import { createCrudService } from "@/services/crud";
import type { CollectionPointInsert, CollectionPointRow } from "@/types/home";

export const collectionPointService = createCrudService<
  CollectionPointRow,
  CollectionPointInsert
>("collection_points", "tempat pengumpulan");
