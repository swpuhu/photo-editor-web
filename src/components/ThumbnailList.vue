<script setup lang="ts">
import Thumbnail from './Thumbnail.vue';
defineProps<{ srcs: string[] }>();
</script>

<template>
    <div class="thumbnail-list">
        <div v-for="src in srcs">
            <Thumbnail :src="src"></Thumbnail>
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
