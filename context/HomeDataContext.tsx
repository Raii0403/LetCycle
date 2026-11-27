import { collectionPointService } from "@/services/collectionPointService";
import { depositService } from "@/services/depositService";
import { wasteCategoryService } from "@/services/wasteCategoryService";
import type {
  CollectionPointRow,
  DepositRow,
  WasteCategoryRow,
} from "@/types/home";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface HomeDataContextType {
  points: CollectionPointRow[];
  categories: WasteCategoryRow[];
  deposits: DepositRow[];
  loading: boolean; // muat pertama kali
  refreshing: boolean; // pull-to-refresh
  error: string | null;
  reload: () => Promise<void>; // muat ulang diam-diam (setelah tambah/ubah/hapus)
  refresh: () => Promise<void>; // dipakai RefreshControl
  retry: () => Promise<void>; // tombol "Coba Lagi"
  totals: { kg: number; bottles: number; count: number; amount: number; points: number };
}

const HomeDataContext = createContext<HomeDataContextType | undefined>(undefined);

export function HomeDataProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState<CollectionPointRow[]>([]);
  const [categories, setCategories] = useState<WasteCategoryRow[]>([]);
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [p, c, d] = await Promise.all([
        collectionPointService.getAll(),
        wasteCategoryService.getAll(),
        depositService.getAll(),
      ]);
      setPoints(p);
      setCategories(c);
      setDeposits(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    void fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const retry = useCallback(async () => {
    setLoading(true);
    await fetchAll();
    setLoading(false);
  }, [fetchAll]);

  const totals = useMemo(
    () => ({
      kg: deposits.reduce((s, d) => s + Number(d.weight_kg), 0),
      bottles: deposits.reduce((s, d) => s + d.bottle_count, 0),
      count: deposits.length,
      amount: deposits.reduce((s, d) => s + d.amount, 0),
      points: deposits.reduce((s, d) => s + d.points, 0),
    }),
    [deposits],
  );

  return (
    <HomeDataContext.Provider
      value={{
        points,
        categories,
        deposits,
        loading,
        refreshing,
        error,
        reload: fetchAll,
        refresh,
        retry,
        totals,
      }}
    >
      {children}
    </HomeDataContext.Provider>
  );
}

export function useHomeData(): HomeDataContextType {
  const ctx = useContext(HomeDataContext);
  if (!ctx) throw new Error("useHomeData harus dipakai di dalam <HomeDataProvider>");
  return ctx;
}
