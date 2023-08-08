<script setup lang="ts">
import ThumbnailList from './components/ThumbnailList.vue';
import Canvas from './components/Canvas.vue';
import { useFileStore } from './store/OpenFile';
import ToolBox from './components/ToolBox.vue';
const fileStore = useFileStore();
</script>

<template>
    <div class="root">
        <div class="left">
            <ThumbnailList :srcs="fileStore.fileUrls" />
        </div>
        <div class="right">
            <Canvas></Canvas>
            <ToolBox></ToolBox>
        </div>
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
