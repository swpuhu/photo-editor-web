<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Camera, Mesh, SimpleEngine } from '../../submodule/renderer/index';
import { Geometry } from '../../submodule/renderer';
import { Scene } from '../../submodule/renderer/Scene';
import { Node } from '../../submodule/renderer';
import { UnLitMaterial } from '../../submodule/renderer';
import { useGlobalStore } from '../store/GlobalStore';
import { Texture } from '../../submodule/renderer/Texture';

let engine: SimpleEngine;
let texture: Texture;
let geo: Geometry;
let canvasDom: HTMLCanvasElement;
let rootDom: HTMLElement;
const canvasRef = ref(null);
const rootRef = ref(null);
const aspect = ref(1);
const styleWidth = ref(0);
const styleHeight = ref(0);
const styleLeft = ref(0);
const styleTop = ref(0);

const computeWidth = (): number => {
    if (!rootDom) {
        return 0;
    }
    if (aspect.value >= 1) {
        return rootDom.parentElement?.clientWidth!;
    } else {
        return rootDom.parentElement?.clientHeight! * aspect.value;
    }
};
const computeHeight = (): number => {
    if (!rootDom) {
        return 0;
    }
    if (aspect.value >= 1) {
        return rootDom.parentElement?.clientWidth! / aspect.value;
    } else {
        return rootDom.parentElement?.clientHeight!;
    }
};

const computeStyleLeft = () => {
    if (!rootDom) {
        return;
    }
    if (aspect.value >= 1) {
        styleLeft.value = 0;
    } else {
        const parentWidth = rootDom.parentElement?.clientWidth!;
        styleLeft.value = (parentWidth - styleWidth.value) / 2;
    }
};

const computeStyleTop = () => {
    if (!rootDom) {
        return;
    }
    if (aspect.value >= 1) {
        const parentHeight = rootDom.parentElement?.clientHeight!;
        styleTop.value = (parentHeight - styleHeight.value) / 2;
    } else {
        styleTop.value = 0;
    }
};
const globalStore = useGlobalStore();
globalStore.$subscribe(async () => {
    if (!canvasDom || !engine) {
        return;
    }
    const currentUrl = globalStore.currentImg;
    if (currentUrl) {
        await texture.loadTexture(currentUrl);
        canvasDom.width = texture.width;
        canvasDom.height = texture.height;
        aspect.value = canvasDom.width / canvasDom.height;
        styleWidth.value = computeWidth();
        styleHeight.value = computeHeight();
        computeStyleLeft();
        computeStyleTop();
        engine.setViewSize(texture.width, texture.height);
    }
});

onMounted(() => {
    canvasDom = canvasRef.value as unknown as HTMLCanvasElement;
    rootDom = rootRef.value as unknown as HTMLElement;
    const gl = canvasDom.getContext('webgl');
    const width = canvasDom.width;
    const height = canvasDom.height;
    engine = new SimpleEngine(gl);
    geo = Geometry.getQuad(width, height);
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
    <div ref="rootRef" class="canvasContainer">
        <canvas
            class="canvas"
            :style="{
                width: styleWidth + 'px',
                height: styleHeight + 'px',
                left: styleLeft + 'px',
                top: styleTop + 'px',
            }"
            :width="500"
            :height="500"
            ref="canvasRef"
        ></canvas>
    </div>
</template>

<style scoped>
.canvasContainer {
    font-size: 0;
}

.canvas {
    position: relative;
}
</style>
