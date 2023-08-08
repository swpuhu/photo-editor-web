import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFileStore } from './OpenFile';

interface ClippingInfo {
    left: number;
    right: number;
    top: number;
    bottom: number;
    aspect: number | 'free';
}

export const useGlobalStore = defineStore('global', () => {
    const fileStore = useFileStore();

    const currentIndex = ref(-1);
    const globalAspect = ref(1);
    const localClippingMap = localStorage.getItem('clippingInfo');

    const clippingMap = ref<Record<string, ClippingInfo>>({});
    if (localClippingMap) {
        clippingMap.value = JSON.parse(localClippingMap);
    }
    const currentImg = computed(() => {
        if (currentIndex.value >= 0) {
            return fileStore.fileUrls[currentIndex.value];
        }

        return '';
    });

    const saveClippingMap = () => {
        localStorage.setItem('clippingInfo', JSON.stringify(clippingMap.value));
    };

    const setCurrentIndex = (index: number) => {
        currentIndex.value = index;
    };

    const addClippingInfo = (index: number, clippingInfo: ClippingInfo) => {
        const fileName = fileStore.fileNames[index];
        clippingMap.value[fileName] = clippingInfo;
        saveClippingMap();
    };

    const getClippingInfo = (index: number): ClippingInfo | undefined => {
        const fileName = fileStore.fileNames[index];
        return clippingMap.value[fileName];
    };

    return {
        currentIndex,
        currentImg,
        globalAspect,
        setCurrentIndex,
        addClippingInfo,
        getClippingInfo,
    };
});
