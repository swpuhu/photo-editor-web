import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFileStore } from './OpenFile';
import { AspectType } from '@simple-render-engine/renderer/script/util';
import { useLocalStorage } from './localStorageStore';

interface ClippingInfo {
    left: number;
    right: number;
    top: number;
    bottom: number;
    aspect: AspectType;
}

export const useGlobalStore = defineStore('global', () => {
    const fileStore = useFileStore();
    const storageStore = useLocalStorage();

    const currentIndex = ref(-1);
    const globalAspect = ref(1);

    const clippingMap = storageStore.getItem('clippingInfo') as Record<
        string,
        ClippingInfo
    >;
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
        const fileName = fileStore.fileNames[index];
        storageStore.setItemAndSave(clippingInfo, fileName);
    };

    const getClippingInfo = (index: number): ClippingInfo | undefined => {
        const fileName = fileStore.fileNames[index];
        return storageStore.getItem(fileName);
    };

    const getCurrentClippingInfo = (): ClippingInfo | undefined => {
        if (
            currentIndex.value >= fileStore.fileNames.length ||
            currentIndex.value < 0
        ) {
            return;
        }
        const fileName = fileStore.fileNames[currentIndex.value];
        return storageStore.getItem(fileName);
    };

    const setCurrentClippingInfo = (v: ClippingInfo) => {
        if (
            currentIndex.value >= fileStore.fileNames.length ||
            currentIndex.value < 0
        ) {
            return;
        }
        const fileName = fileStore.fileNames[currentIndex.value];
        storageStore.setItemAndSave(v, fileName);
    };

    return {
        currentIndex,
        currentImg,
        globalAspect,
        setCurrentIndex,
        addClippingInfo,
        getClippingInfo,
        getCurrentClippingInfo,
        setCurrentClippingInfo,
    };
});
