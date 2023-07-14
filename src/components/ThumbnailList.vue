<script setup lang="ts">
import Thumbnail from './Thumbnail.vue';
import { useGlobalStore } from '../store/GlobalStore';
defineProps<{ srcs: string[] }>();

const globalStore = useGlobalStore();
const onClick = (index: number) => {
    globalStore.setCurrentIndex(index);
};
</script>

<template>
    <div class="thumbnail-list">
        <div v-for="(src, i) in srcs">
            <Thumbnail
                :src="src"
                :on-click="onClick.bind(Thumbnail, i)"
            ></Thumbnail>
        </div>
    </div>
</template>

<style scoped>
.thumbnail-list {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
