import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
    const fileNames = ref(['']);
    const fileBlobs = ref([Blob]);
    async function openDirectory() {
        const fileHandle = await showDirectoryPicker();
        const entries = await (fileHandle as any).entries();
        for await (const [_key, value] of entries) {
            const file = await (value as FileSystemFileHandle).getFile();
            console.log(file);
        }
    }

    return { fileNames, fileBlobs, openDirectory }
})