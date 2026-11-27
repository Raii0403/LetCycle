import { createCrudService } from "@/services/crud";
import type { DepositInsert, DepositRow } from "@/types/home";

export const depositService = createCrudService<DepositRow, DepositInsert>(
  "deposits",
  "setoran",
);

// Poin yang didapat per kilogram sampah yang disetor.
export const POINTS_PER_KG = 10;
