<script setup lang="ts">
const props = defineProps<{
    buttonName: string;
    onClick?: () => void;
}>();

const onClick = () => {
    props.onClick && props.onClick();
};
</script>

<template>
    <div @click="onClick" class="button">
        {{ props.buttonName }}
    </div>
</template>

<style scoped>
.button {
    background: #a5f2f6;
    padding: 5px;
    border: 2px solid #3785e5;
    border-radius: 10px;
    cursor: pointer;
}

.button:active {
    background-color: #a5d0f6;
}
</style>
