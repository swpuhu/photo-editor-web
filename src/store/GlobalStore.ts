import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFileStore } from './OpenFile';

export const useGlobalStore = defineStore('global', () => {
    const fileStore = useFileStore();

    const currentIndex = ref(-1);
    const currentImg = computed(() => {
        if (currentIndex.value >= 0) {
            return fileStore.fileUrls[currentIndex.value];
        }

        return '';
    });

    const setCurrentIndex = (index: number) => {
        currentIndex.value = index;
    }

    return { currentIndex, currentImg, setCurrentIndex };
});
