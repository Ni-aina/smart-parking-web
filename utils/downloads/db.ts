const DB_NAME = "downloads";
const STORE_NAME = "chunks";

const openDb = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME)
        }

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error)
    })
}

export const getSavedChunk = async (key: string) => {
    const db = await openDb();

    return new Promise<Blob | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error)
    })
}

export const saveChunk = async (key: string, blob: Blob) => {
    const db = await openDb();

    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(blob, key);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error)
    })
}

export const clearSavedChunk = async (key: string) => {
    const db = await openDb();

    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error)
    })
}