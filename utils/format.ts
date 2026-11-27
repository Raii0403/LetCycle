// Angka 1234567 -> "1.234.567"
export function formatNumber(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Berat dengan koma desimal: 1.5 -> "1,5 kg"
export function formatKg(n: number): string {
  return `${String(Math.round(n * 100) / 100).replace(".", ",")} kg`;
}

// 8200000 -> "Rp 8,2 jt"; di bawah sejuta -> "Rp 124.500"
export function formatCompactRupiah(n: number): string {
  if (n >= 1_000_000) {
    return `Rp ${(Math.round(n / 100_000) / 10).toString().replace(".", ",")} jt`;
  }
  return `Rp ${formatNumber(n)}`;
}

// Mengubah teks angka ("1,5" atau "1.5") menjadi number.
export function parseDecimal(text: string): number {
  return Number(text.trim().replace(",", "."));
}
