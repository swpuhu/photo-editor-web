import { defineStore } from 'pinia';
const LOCAL_STORAGE_KEY = 'localStorage';
export const useLocalStorage = defineStore('localStorage', () => {
    const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    let data: Record<string | number, any> = {};
    if (dataStr) {
        data = JSON.parse(dataStr);
    }

    const getItem = (...keys: (string | number)[]) => {
        let result: any;
        for (let i = 0; i < keys.length; i++) {
            result = data[keys[i]];
        }
        return result;
    };

    const setItemAndSave = (v: any, ...keys: (string | number)[]) => {
        let result: any = data;
        for (let i = 0; i < keys.length - 1; i++) {
            result = data[keys[i]];
        }
        result[keys[keys.length - 1]] = v;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    };
    return {
        getItem,
        setItemAndSave,
    };
});
