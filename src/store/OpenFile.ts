import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFileStore = defineStore('file', () => {
    const fileNames = ref(['']);
    const fileUrls = ref(['']);
    const fileBlobs = ref([Blob]);

    async function openDirectory() {
        fileNames.value.length = 0;
        fileUrls.value.length = 0;
        fileBlobs.value.length = 0;
        const fileHandle = await showDirectoryPicker();
        const entries = await (fileHandle as any).entries();
        for await (const [_key, value] of entries) {
            if ((value as FileSystemFileHandle).kind === 'file') {
                const file = await (value as FileSystemFileHandle).getFile();
                if (file.type === 'image/png' || file.type === 'image/jpeg') {
                    const url = URL.createObjectURL(file);
                    fileUrls.value.push(url);
                }
            }
        }
    }

    return { fileNames, fileBlobs, fileUrls, openDirectory };
});
