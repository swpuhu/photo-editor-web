<script setup lang="ts">
import ThumbnailList from './components/ThumbnailList.vue';
import { useFileStore } from './store/OpenFile';
const fileStore = useFileStore();
</script>

<template>
    <div class="root">
        <div class="left">
            <ThumbnailList :srcs="[]" />
        </div>
        <div class="right"></div>
    </div>
    <div class="open-button">
        <div @click="fileStore.openDirectory">OpenFile</div>
    </div>
</template>

<style scoped>
.root {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
}

.left {
    width: 20%;
}

.right {
    flex: 1;
}

.open-button {
    position: absolute;
    z-index: 99;
}
</style>
