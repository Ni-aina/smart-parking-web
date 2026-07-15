import { getSavedChunk, saveChunk, clearSavedChunk } from "./db";
import { formatMB, formatSpeed, formatTimeLeft } from "./format";

export const downloadFile = async (
    url: string,
    filename: string,
    language: "en" | "fr",
    onProgress: (
        receivedMB: string,
        totalMB: string,
        percent: number,
        speed: string,
        timeLeft: string
    ) => void
): Promise<string> => {
    const saved = await getSavedChunk(filename);
    let chunks: BlobPart[] = saved ? [saved] : [];
    let received = saved ? saved.size : 0;

    const headers: Record<string, string> = {};

    if (received > 0) {
        headers.Range = `bytes=${received}-`
    }

    const response = await fetch(url, { headers });

    if (response.status === 416) {
        await clearSavedChunk(filename);
        return downloadFile(url, filename, language, onProgress)
    }

    if (!response.ok) {
        throw new Error()
    }

    if (received > 0 && response.status !== 206) {
        chunks = [];
        received = 0
    }

    const total = response.status === 206
        ? Number(response.headers.get("content-range")?.split("/")[1])
        : Number(response.headers.get("content-length"));

    const reader = response.body!.getReader();
    let lastReceived = received;
    let lastTime = Date.now();
    let lastSaveTime = Date.now();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break
            }

            chunks.push(value as BlobPart);
            received += value.length;

            const now = Date.now();

            if (now - lastSaveTime >= 3000) {
                const merged = new Blob(chunks);
                await saveChunk(filename, merged);
                chunks = [merged];
                lastSaveTime = now
            }

            const elapsed = (now - lastTime) / 1000;

            if (elapsed >= 0.5) {
                const bytePerSec = (received - lastReceived) / elapsed;
                const remaining = bytePerSec > 0 ? Math.round((total - received) / bytePerSec) : 0;

                lastReceived = received;
                lastTime = now;

                onProgress(
                    formatMB(received),
                    formatMB(total),
                    Math.round((received / total) * 100),
                    formatSpeed(bytePerSec),
                    formatTimeLeft(remaining, language)
                )
            }
        }
    } catch (error) {
        await saveChunk(filename, new Blob(chunks));
        throw error
    }

    const blob = new Blob(chunks, { type: "application/vnd.android.package-archive" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);

    await clearSavedChunk(filename);

    return formatMB(total)
}