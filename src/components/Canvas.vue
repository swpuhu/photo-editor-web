<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Camera, Node, SimpleEngine } from '../../submodule/renderer/index';
import { Scene } from '../../submodule/renderer/Scene';
import { Sprite } from '../../submodule/renderer/script/Sprite';
import { ClippingFrame } from '../script/ClippingFrame';
import { SolidColor } from '../../submodule/renderer/script/SolidColor';
import { SolidColorMaterial } from '../../submodule/renderer/material/SolidColorMaterial';
import { useGlobalStore } from '../store/GlobalStore';

import { Node2D } from '../../submodule/renderer/Node2D';
import { Event } from '../../submodule/renderer/Event';
import { TouchEvent } from '../../submodule/renderer/Event';
let scene: Scene;
let engine: SimpleEngine;
let sprite: Sprite;
let canvasDom: HTMLCanvasElement;
let rootDom: HTMLElement;
const canvasRef = ref(null);
const rootRef = ref(null);

let parentWidth = 0;
let parentHeight = 0;
let imgDisplayNode: Node2D;
const globalStore = useGlobalStore();
globalStore.$subscribe(async () => {
    if (!canvasDom || !engine) {
        return;
    }
    const currentUrl = globalStore.currentImg;
    if (currentUrl && imgDisplayNode) {
        await sprite.setURL(currentUrl);
        const spriteAsp = sprite.rawWidth / sprite.rawHeight;
        const canvasAsp = canvasDom.width / canvasDom.height;
        if (spriteAsp > canvasAsp) {
            // adapt to width
            imgDisplayNode.width = canvasDom.width;
            imgDisplayNode.height = canvasDom.width / spriteAsp;
        } else {
            imgDisplayNode.height = canvasDom.height;
            imgDisplayNode.width = canvasDom.height * spriteAsp;
        }
        // engine.setViewSize(sprite.rawWidth, sprite.rawHeight);

        // aspect.value = canvasDom.width / canvasDom.height;
        // styleWidth.value = computeWidth();
        // styleHeight.value = computeHeight();
        // computeStyleLeft();
        // computeStyleTop();
    }
});

const initScene = () => {
    console.log('init scene!');
    rootDom = rootRef.value as unknown as HTMLElement;
    canvasDom = canvasRef.value as unknown as HTMLCanvasElement;

    parentWidth = rootDom.parentElement?.clientWidth!;
    parentHeight = rootDom.parentElement?.clientHeight!;
    canvasDom.width = parentWidth;
    canvasDom.height = parentHeight;
    const gl = canvasDom.getContext('webgl2', {
        alpha: false,
    });

    const width = canvasDom.width;
    const height = canvasDom.height;
    console.log(width, height);
    engine = new SimpleEngine(gl!);
    window.engine = engine;
    scene = new Scene('scene');
    const root = new Node('root');
    root.x = parentWidth / 2;
    root.y = parentHeight / 2;
    imgDisplayNode = new Node2D('img');
    imgDisplayNode.width = 100;
    imgDisplayNode.height = 100;
    sprite = imgDisplayNode.addScript(Sprite);
    root.addChildren(imgDisplayNode);

    imgDisplayNode.on(Event.TOUCH, (e: TouchEvent) => {
        console.log('click', e);
    });

    let node2 = new Node2D('test white');
    node2.width = 300;
    node2.height = 300;
    const solidColor = node2.addScript(ClippingFrame);
    // solidColor.setMaterial(new SolidColorMaterial());
    // solidColor.setColor(1, 0.5, 0, 1);
    node2.x = 0;
    node2.y = 0;
    root.addChildren(node2);

    root.on(Event.TOUCH, (e: TouchEvent) => {
        console.log('click from root');
    });
    const cam = new Camera(0, width, 0, height, -100, 100, 'orthoCam');
    // new Mesh(geo, mat, root);
    scene.addChildren(root);

    scene.addChildren(cam);
    engine.setScene(scene);
    engine.run();
};

const destroyScene = () => {
    if (scene) {
        scene.destroy();
    }
    if (engine) {
        engine.destroy();
    }
};

onMounted(() => {
    initScene();
});

onUnmounted(() => {
    destroyScene();
});

// window.destroy = destroyScene;
</script>

<template>
    <div ref="rootRef" class="canvasContainer">
        <canvas
            class="canvas"
            :style="{
                // width: styleWidth + 'px',
                // height: styleHeight + 'px',
                // left: styleLeft + 'px',
                // top: styleTop + 'px',
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
