<script setup lang="ts">
import { computed, ref } from 'vue';
import { eventBus } from '../script/eventBus';
import CheckBox from './CheckBox.vue';
import { SET_ASPECT } from '@src/script/enum';
import Button from './Button.vue';
import { useToolboxStore } from '../store/ToolBoxStore';
import { useGlobalStore } from '../store/GlobalStore';
import { AspectType } from '@simple-render-engine/renderer/script/util';

const toolboxStore = useToolboxStore();
const globalStore = useGlobalStore();
const inputRef = ref<HTMLInputElement | null>(null);
const aspectValue = computed<AspectType>(() => {
    if (toolboxStore.useGlobalAspect) {
        return toolboxStore.globalAspect;
    }
    const currentClipInfo = globalStore.getCurrentClippingInfo();
    if (currentClipInfo) {
        return currentClipInfo.aspect;
    }
    return 'free';
});
const setAspectAction = () => {
    const inputDom = inputRef.value as HTMLInputElement;
    let value = inputDom ? inputDom.value : 'free';
    value === 'free' ? value : +value;
    if (typeof value === 'number' && isNaN(value)) {
        value = 'free';
    }
    setAspect(value as AspectType);
};

const setAspect = (value: AspectType) => {
    if (toolboxStore.useGlobalAspect) {
        toolboxStore.setAspect(value);
        eventBus.emit(SET_ASPECT, value);
    } else {
        const currentClipInfo = globalStore.getCurrentClippingInfo();
        if (currentClipInfo) {
            currentClipInfo.aspect = value;
            eventBus.emit(SET_ASPECT, currentClipInfo.aspect);
            globalStore.setCurrentClippingInfo(currentClipInfo);
        }
    }
};

const checkBoxOnClick = () => {
    toolboxStore.toggleAspect();
    if (toolboxStore.useGlobalAspect) {
        eventBus.emit(SET_ASPECT, toolboxStore.globalAspect);
    } else {
        const currentClipInfo = globalStore.getCurrentClippingInfo();
        if (currentClipInfo) {
            eventBus.emit(SET_ASPECT, currentClipInfo.aspect);
        }
    }
};

const resetAspect = () => {
    console.log('reset aspect');
};
</script>

<template>
    <div class="tool-aspect">
        <div class="flex">
            <div>Aspect:</div>
            <input
                ref="inputRef"
                class="input"
                :value="aspectValue"
                type="text"
                @blur="setAspectAction"
            />
        </div>
        <div class="flex">
            <CheckBox
                :selected="toolboxStore.useGlobalAspect"
                :selected-name="'Use Global'"
                :un-selected-name="'Use Local'"
                :on-click="checkBoxOnClick"
            />
            <Button button-name="Set Aspect" :on-click="setAspectAction" />
            <Button button-name="Reset" :on-click="resetAspect" />
        </div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 5px 0;
}
.tool-aspect {
    background: #cbf4f6;
    padding: 5px;
    border: 2px solid #3785e5;
    border-radius: 10px;
    min-width: 240px;
}

.tool-aspect .input {
    width: 30px;
}
</style>
