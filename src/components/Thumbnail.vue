<script setup lang="ts">
defineProps<{ src: string }>();
</script>

<template>
    <div class="thumbnail">
        <img :src="src" />
    </div>
</template>

<style scoped></style>
