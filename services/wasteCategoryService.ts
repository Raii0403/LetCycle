import { createCrudService } from "@/services/crud";
import type { WasteCategoryInsert, WasteCategoryRow } from "@/types/home";

export const wasteCategoryService = createCrudService<
  WasteCategoryRow,
  WasteCategoryInsert
>("waste_categories", "kategori sampah");
