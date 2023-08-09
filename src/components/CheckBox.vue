<script setup lang="ts">
const props = defineProps<{
    selectedName: string;
    unSelectedName: string;
    selected: boolean;
    onClick?: () => void;
}>();

const onClick = () => {
    props.onClick && props.onClick();
};
</script>

<template>
    <div
        @click="onClick"
        :class="'checkbox ' + (props.selected ? 'active' : '')"
    >
        <div class="content">
            {{ selected ? props.selectedName : props.unSelectedName }}
        </div>
    </div>
</template>

<style scoped>
.checkbox {
    color: white;
    background-color: #95c0a2;
    padding: 5px;
    border-radius: 10px;
    min-width: 100px;
    cursor: pointer;
}

.content {
    text-align: center;
}

.checkbox.active {
    background-color: #2ab656;
}
</style>
