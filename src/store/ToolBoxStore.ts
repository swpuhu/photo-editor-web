import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGlobalStore } from './GlobalStore';
import { AspectType } from '@simple-render-engine/renderer/script/util';
import { useLocalStorage } from './localStorageStore';
const GLOBAL_ASPECT_KEY = 'globalAspect';
export const useToolboxStore = defineStore('toolbox', () => {
    const globalStore = useGlobalStore();
    const storageStore = useLocalStorage();
    const storageAspect = storageStore.getItem(GLOBAL_ASPECT_KEY) || 'free';
    const useGlobalAspect = ref(true);
    const globalAspect = ref<AspectType>(storageAspect);

    const toggleAspect = () => {
        useGlobalAspect.value = !useGlobalAspect.value;
    };

    const setAspect = (aspect: AspectType) => {
        if (useGlobalAspect.value) {
            globalAspect.value = aspect;
            storageStore.setItemAndSave(aspect, GLOBAL_ASPECT_KEY);
        } else {
            const currentClippingInfo = globalStore.getCurrentClippingInfo();
            if (currentClippingInfo) {
                currentClippingInfo.aspect = aspect;
                globalStore.setCurrentClippingInfo({ ...currentClippingInfo });
            }
        }
    };

    return {
        useGlobalAspect,
        globalAspect,
        toggleAspect,
        setAspect,
    };
});
