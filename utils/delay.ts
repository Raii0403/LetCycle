// Menunggu beberapa milidetik sebelum melanjutkan proses.
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
