export const downloadFile = async (
    url: string,
    filename: string,
    onProgress: (receivedMB: string, totalMB: string, percent: number, speed: string) => void
) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error();

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength) : 0;
    const reader = response.body!.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let received = 0;
    let lastReceived = 0;
    let lastTime = Date.now();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        const now = Date.now();
        const elapsed = (now - lastTime) / 1000;

        if (total && elapsed >= 0.5) {
            const bytePerSec = (received - lastReceived) / elapsed;
            const speed = bytePerSec > 1024 * 1024
                ? `${(bytePerSec / (1024 * 1024)).toFixed(1)} MB/s`
                : `${(bytePerSec / 1024).toFixed(0)} KB/s`;

            lastReceived = received;
            lastTime = now;

            onProgress(
                (received / (1024 * 1024)).toFixed(1),
                (total / (1024 * 1024)).toFixed(1),
                Math.round((received / total) * 100),
                speed
            )
        }
    }

    const blob = new Blob(chunks, { type: "application/vnd.android.package-archive" });
    const url2 = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url2;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url2);

    return (total / (1024 * 1024)).toFixed(1);
}