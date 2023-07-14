<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const canvasRef = ref(null)
setTimeout(() => {
    console.log(canvasRef)
}, 100)



onMounted(() => {

})
</script>

<template>
    <div class="canvas">
        <canvas :width="500" :height="500" ref="canvasRef"></canvas>
    </div>
</template>

<style scoped></style>
