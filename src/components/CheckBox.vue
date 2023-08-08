<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    selectedName: string;
    unSelectedName: string;
    selected: boolean;
    onClick?: (selected: boolean) => void;
}>()

const selected = ref(props.selected);

const onClick = () => {
    console.log('click');
    selected.value = !selected.value
    props.onClick && props.onClick(selected.value);
}

</script>

<template>
    <div @click="onClick" :class="'checkbox ' + (selected ? 'active' : '') ">
        <div class="content">{{ selected ? props.selectedName : props.unSelectedName }}</div>
    </div>
</template>

<style scoped>
.checkbox {
    color: white;
    background-color: #95c0a2;
    padding: 5px;
    border-radius: 10px;
    min-width: 100px;
}

.content {
    text-align: center;
}

.checkbox.active {
    background-color: #2ab656;

}
</style>
