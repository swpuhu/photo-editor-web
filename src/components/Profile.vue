<script setup lang="ts">
defineProps<{
    frameRate: number;
    drawCall: number;
}>();
</script>

<template>
    <div class="profile">
        <div class="profile-item">
            <div>Frame Rate:</div>
            <div>{{ $props.frameRate }}</div>
        </div>

        <div class="profile-item">
            <div>DrawCall:</div>
            <div>{{ $props.drawCall }}</div>
        </div>
    </div>
</template>

<style scoped>
.thumbnail img {
    width: 100%;
    font-size: 0;
    margin: 2px 0;
}
</style>
