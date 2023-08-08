<script setup lang="ts">
import { ref } from 'vue';
import {eventBus} from '../script/eventBus';
import CheckBox from './CheckBox.vue';
import { ASPECT_CHANGE } from '@src/script/enum';

const aspectValue = ref(1);
const onBlur = () => {
    eventBus.emit(ASPECT_CHANGE, aspectValue.value);
}

</script>

<template>
    <div class="tool-aspect">
        <div>Aspect: </div>
        <input class="input" v-model="aspectValue" type="text" @blur="onBlur">
        <CheckBox :selected="false"
        :selected-name="'Use Global'"
        :un-selected-name="'Use Local'"></CheckBox>
    </div>
</template>

<style scoped>
.tool-aspect {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
