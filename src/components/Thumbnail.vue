<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
    <div class="thumbnail">
        <img :src="src" />
    </div>
</template>

<style scoped>
.thumbnail img {
    width: 100%;
    font-size: 0;
    margin: 2px 0;
}
</style>
