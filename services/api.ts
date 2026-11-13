// Mengambil JSON dari API dan menolak permintaan yang gagal atau terlalu lama.
export function fetchJson<T>(
  url: string,
  timeoutMs = 5000,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Timeout, server terlalu lambat");
    }, timeoutMs);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server mengembalikan status ${response.status}`);
        }
        return response.json() as Promise<T>;
      })
      .then((data) => {
        clearTimeout(timeout);
        resolve(data);
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        if (error instanceof Error) {
          reject(`Gagal mengambil data: ${error.message}`);
          return;
        }
        reject("Gagal mengambil data dari server");
      });
  });
}
