<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ClippingFrame } from '../script/ClippingFrame';
import { useGlobalStore } from '../store/GlobalStore';
import { Scene } from '@simple-render-engine/renderer/Scene';
import { Camera, Node, SimpleEngine } from '@simple-render-engine/renderer';
import { Sprite } from '@simple-render-engine/renderer/script/Sprite';
import { GridBackgroundMaterial } from '@simple-render-engine/renderer/material/GridBackgroundMaterial';
import { CustomQuadRenderScript } from '@simple-render-engine/renderer/script/CustomQuadRenderScript';
import { Node2D } from '@simple-render-engine/renderer/Node2D';
import Profile from './Profile.vue';
import { eventBus } from '@src/script/eventBus';
import { SET_ASPECT } from '@src/script/enum';
import { useToolboxStore } from '@src/store/ToolBoxStore';

let scene: Scene;
let engine: SimpleEngine;
let clippingNode: Node2D;
let sprite: Sprite;
let canvasDom: HTMLCanvasElement;
let rootDom: HTMLElement;
const canvasRef = ref(null);
const rootRef = ref(null);
const frameRate = ref(0);
const drawCall = ref(0);

let parentWidth = 0;
let parentHeight = 0;

let imgDisplayNode: Node2D;
const globalStore = useGlobalStore();
const toolboxStore = useToolboxStore();
const MARGIN = 50;
globalStore.$subscribe(async () => {
    if (!canvasDom || !engine) {
        return;
    }
    const currentUrl = globalStore.currentImg;
    if (!currentUrl) {
        imgDisplayNode.active = false;
    }

    imgDisplayNode.active = true;
    clippingNode.active = true;
    if (currentUrl && imgDisplayNode) {
        await sprite.setURL(currentUrl);
        const spriteAsp = sprite.rawWidth / sprite.rawHeight;
        const canvasAsp = canvasDom.width / canvasDom.height;
        if (spriteAsp > canvasAsp) {
            // adapt to width
            imgDisplayNode.width = canvasDom.width - MARGIN;
            imgDisplayNode.height = (canvasDom.width - MARGIN) / spriteAsp;
        } else {
            imgDisplayNode.height = canvasDom.height - MARGIN;
            imgDisplayNode.width = (canvasDom.height - MARGIN) * spriteAsp;
        }
        const frame = clippingNode.getScript(ClippingFrame);
        const currentClipInfo = globalStore.getCurrentClippingInfo();
        if (frame) {
            frame.adaptToNode(imgDisplayNode, currentClipInfo);
            if (toolboxStore.useGlobalAspect) {
                frame.setAspect(toolboxStore.globalAspect);
            } else if (currentClipInfo) {
                frame.setAspect(currentClipInfo.aspect);
            }
        }
    }
});

eventBus.on(SET_ASPECT, (aspect: number) => {
    if (engine) {
        const frame = clippingNode.getScript(ClippingFrame);
        if (frame) {
            frame.setAspect(aspect);
        }
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
    engine = new SimpleEngine(gl!, {
        frameRate: 30,
        designedSize: {
            width: canvasDom.width,
            height: canvasDom.height,
        },
    });
    scene = new Scene('scene');
    const root = new Node('root');
    root.x = parentWidth / 2;
    root.y = parentHeight / 2;
    imgDisplayNode = new Node2D('img');
    const backgroundNode = new Node2D('background');
    const backgroundRenderScript = backgroundNode.addScript(
        CustomQuadRenderScript
    );
    backgroundNode.width = width;
    backgroundNode.height = height;
    const gridMat = new GridBackgroundMaterial();
    gridMat.setProperty('u_resolution', [width, height]);
    backgroundRenderScript.setMaterial(gridMat);

    imgDisplayNode.width = 0;
    imgDisplayNode.height = 0;
    sprite = imgDisplayNode.addScript(Sprite);
    clippingNode = new Node2D('test white');
    clippingNode.width = 0;

    clippingNode.height = 0;
    clippingNode.active = false;
    const frame = clippingNode.addScript(ClippingFrame);
    frame.on(ClippingFrame.ADJUST_END, () => {
        const clippingInfo = frame.getClippingInfo();
        if (globalStore.currentIndex >= 0 && clippingInfo) {
            globalStore.addClippingInfo(globalStore.currentIndex, clippingInfo);
        }
    });
    clippingNode.x = 0;
    clippingNode.y = 0;
    root.addChildren(backgroundNode, imgDisplayNode, clippingNode);

    const cam = new Camera(0, width, 0, height, -100, 100, 'orthoCam');
    // new Mesh(geo, mat, root);
    scene.addChildren(root);

    scene.addChildren(cam);
    engine.on(SimpleEngine.BEFORE_RUN, onFrameRateChange);
    engine.on(SimpleEngine.UPDATE_DRAW_CALL, onUpdateDrawCall);
    engine.setScene(scene);
    engine.run();
};

function onFrameRateChange(v: number) {
    frameRate.value = v;
}

function onUpdateDrawCall(v: number) {
    drawCall.value = v;
}
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
            :width="500"
            :height="500"
            ref="canvasRef"
        ></canvas>
        <Profile :frame-rate="frameRate" :draw-call="drawCall" />
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
