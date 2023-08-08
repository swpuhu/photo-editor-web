import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFileStore } from './OpenFile';

interface ClippingInfo {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export const useGlobalStore = defineStore('global', () => {
    const fileStore = useFileStore();

    const currentIndex = ref(-1);
    const clippingMap = ref<Record<number, ClippingInfo>>({});
    const currentImg = computed(() => {
        if (currentIndex.value >= 0) {
            return fileStore.fileUrls[currentIndex.value];
        }

        return '';
    });

    const setCurrentIndex = (index: number) => {
        currentIndex.value = index;
    };

    const addClippingInfo = (index: number, clippingInfo: ClippingInfo) => {
        clippingMap.value = {
            ...clippingMap.value,
            ...{ [index]: clippingInfo },
        };
    };

    const getClippingInfo = (index: number): ClippingInfo | undefined => {
        return clippingMap.value[index];
    };

    return {
        currentIndex,
        currentImg,
        setCurrentIndex,
        addClippingInfo,
        getClippingInfo,
    };
});
