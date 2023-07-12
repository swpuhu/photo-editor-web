<script setup lang="ts">
import { ref } from 'vue';

const canvasRef = ref(null)
setTimeout(() => {
    console.log(canvasRef)
}, 100)
</script>

<template>
    <div class="canvas">
        <!-- <canvas :width="4096" :height="4096" ref="canvasRef"></canvas> -->
    </div>
</template>

<style scoped></style>
