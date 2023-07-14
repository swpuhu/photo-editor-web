<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, Mesh, SimpleEngine } from '../../submodule/renderer/index';
import { Geometry } from '../../submodule/renderer';
import { Scene } from '../../submodule/renderer/Scene';
import { Node } from '../../submodule/renderer';
import { UnLitMaterial } from '../../submodule/renderer';
import { useGlobalStore } from '../store/GlobalStore';
import { Texture } from '../../submodule/renderer/Texture';

const canvasRef = ref(null);
const globalStore = useGlobalStore();
globalStore.$subscribe(async (mutation, state) => {
    const currentUrl = globalStore.currentImg;
    if (currentUrl) {
        await texture.loadTexture(currentUrl);
    }
});

let engine: SimpleEngine;
let texture: Texture;
onMounted(() => {
    const canvasDom = canvasRef.value as unknown as HTMLCanvasElement;
    const gl = canvasDom.getContext('webgl');
    const width = canvasDom.width;
    const height = canvasDom.height;
    engine = new SimpleEngine(gl);
    const geo = Geometry.getQuad(width, height);
    const scene = new Scene('scene');
    const root = new Node('root');
    texture = new Texture();
    const mat = new UnLitMaterial(texture);

    const cam = new Camera(
        -width / 2,
        width / 2,
        -height / 2,
        height / 2,
        -100,
        100,
        'orthoCam'
    );

    new Mesh(geo, mat, root);
    scene.addChildren(root);
    scene.addChildren(cam);
    engine.setScene(scene);
    engine.run();
});
</script>

<template>
    <div class="canvas">
        <canvas :width="500" :height="500" ref="canvasRef"></canvas>
    </div>
</template>

<style scoped></style>
