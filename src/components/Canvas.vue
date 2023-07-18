<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    Camera,
    Mesh,
    Node,
    SimpleEngine,
} from '../../submodule/renderer/index';
import { Geometry } from '../../submodule/renderer';
import { Scene } from '../../submodule/renderer/Scene';
import { Sprite } from '../../submodule/renderer/script/Sprite';
import { useGlobalStore } from '../store/GlobalStore';

import { Node2D } from '../../submodule/renderer/Node2D';
import { Event } from '../../submodule/renderer/Event';
import { TouchEvent } from '../../submodule/renderer/Event';
import { SpriteDefaultMaterial } from '../../submodule/renderer/material/SpriteDefaultMaterial';

let engine: SimpleEngine;
let sprite: Sprite;
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

let parentWidth = 0;
let parentHeight = 0;
let imgDisplayNode: Node2D;

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
    rootDom = rootRef.value as unknown as HTMLElement;
    canvasDom = canvasRef.value as unknown as HTMLCanvasElement;

    parentWidth = rootDom.parentElement?.clientWidth!;
    parentHeight = rootDom.parentElement?.clientHeight!;
    canvasDom.width = parentWidth;
    canvasDom.height = parentHeight;
    const gl = canvasDom.getContext('webgl2');
    const width = canvasDom.width;
    const height = canvasDom.height;
    console.log(width, height);
    engine = new SimpleEngine(gl!);
    geo = Geometry.getQuad(width, height);
    const scene = new Scene('scene');
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

    root.on(Event.TOUCH, (e: TouchEvent) => {
        console.log('click from root');
    });
    const mat = new SpriteDefaultMaterial();
    const cam = new Camera(0, width, 0, height, -100, 100, 'orthoCam');
    // new Mesh(geo, mat, root);
    scene.addChildren(root);

    scene.addChildren(cam);
    engine.setScene(scene);
    engine.run();
};

onMounted(() => {
    initScene();
});
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
