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
) => {
    const saved = await getSavedChunk(filename);
    const chunks: Blob[] = saved ? [saved] : [];
    let received = saved ? saved.size : 0;

    const headers: Record<string, string> = {};

    if (received > 0) {
        headers.Range = `bytes=${received}-`
    }

    const response = await fetch(url, { headers });

    if (!response.ok && response.status !== 206) {
        throw new Error()
    }

    const contentRange = response.headers.get("content-range");
    const contentLength = response.headers.get("content-length");
    const total = contentRange
        ? Number(contentRange.split("/")[1])
        : received + Number(contentLength);

    const reader = response.body!.getReader();
    let lastReceived = received;
    let lastTime = Date.now();

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break
        }

        chunks.push(new Blob([value as BlobPart]));
        received += value.length;

        await saveChunk(filename, new Blob(chunks as BlobPart[]));

        const now = Date.now();
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

    const blob = new Blob(chunks as BlobPart[], { type: "application/vnd.android.package-archive" });
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