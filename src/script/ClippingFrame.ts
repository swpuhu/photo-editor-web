import { Material } from '@simple-render-engine/renderer';
import { Event, TouchEvent } from '@simple-render-engine/renderer/Event';
import { Node2D } from '@simple-render-engine/renderer/Node2D';
import { SolidColorMaterial } from '@simple-render-engine/renderer/material/SolidColorMaterial';
import { EngineScript } from '@simple-render-engine/renderer/script/EngineScript';
import { SolidColor } from '@simple-render-engine/renderer/script/SolidColor';
import {
    angle2Rad,
    createHierarchyTree,
} from '@simple-render-engine/renderer/script/util';
const DEFAULT_LINE_WIDTH = 2;
export class ClippingFrame extends EngineScript {
    private __leftTopCtr: Node2D | null = null;
    private __rightTopCtr: Node2D | null = null;
    private __leftBottomCtr: Node2D | null = null;
    private __rightBottomCtr: Node2D | null = null;
    private __hLine1: Node2D | null = null;
    private __hLine2: Node2D | null = null;
    private __vLine1: Node2D | null = null;
    private __vLine2: Node2D | null = null;
    declare node: Node2D;
    protected onLoad(): void {
        const ctrlMaterial = new SolidColorMaterial();

        const hierarchyTree = createHierarchyTree([
            {
                name: 'lt',
                options: {
                    ref: 'lt',
                },
            },
            {
                name: 'rt',
                options: {
                    ref: 'rt',
                },
            },
            {
                name: 'lb',
                options: {
                    ref: 'lb',
                },
            },
            {
                name: 'rb',
                options: {
                    ref: 'rb',
                },
            },
            {
                name: 'hLine1',
                options: {
                    ref: 'hLine1',
                    anchorX: 0,
                },
            },
            {
                name: 'hLine2',
                options: {
                    ref: 'hLine2',
                    anchorX: 0,
                },
            },
            {
                name: 'vLine1',
                options: {
                    ref: 'vLine1',
                    anchorY: 0,
                },
            },
            {
                name: 'vLine2',
                options: {
                    ref: 'vLine2',
                    anchorY: 0,
                },
            },
        ]);
        const {
            lt: __leftTopCtr,
            rt: __rightTopCtr,
            lb: __leftBottomCtr,
            rb: __rightBottomCtr,
            hLine1: __hLine1,
            hLine2: __hLine2,
            vLine1: __vLine1,
            vLine2: __vLine2,
        } = hierarchyTree;

        this.__leftTopCtr = __leftTopCtr as Node2D;
        this.__rightTopCtr = __rightTopCtr as Node2D;
        this.__leftBottomCtr = __leftBottomCtr as Node2D;
        this.__rightBottomCtr = __rightBottomCtr as Node2D;

        this.__hLine1 = __hLine1 as Node2D;
        this.__hLine2 = __hLine2 as Node2D;
        this.__vLine1 = __vLine1 as Node2D;
        this.__vLine2 = __vLine2 as Node2D;

        this.__addScript(this.__leftTopCtr, ctrlMaterial);
        this.__addScript(this.__rightTopCtr, ctrlMaterial);
        this.__addScript(this.__leftBottomCtr, ctrlMaterial);
        this.__addScript(this.__rightBottomCtr, ctrlMaterial);

        this.__addScript(this.__hLine1, ctrlMaterial);
        this.__addScript(this.__hLine2, ctrlMaterial);
        this.__addScript(this.__vLine1, ctrlMaterial);
        this.__addScript(this.__vLine2, ctrlMaterial);

        this.node.addChildren(
            this.__leftTopCtr,
            this.__rightTopCtr,
            this.__leftBottomCtr,
            this.__rightBottomCtr,
            this.__hLine1,
            this.__hLine2,
            this.__vLine1,
            this.__vLine2
        );
        this.__bindEvents();
    }

    private __bindEvents(): void {
        this.node.on(Event.TOUCH_START, e => {
            console.log('clipping frame', e);
        });

        if (this.__leftTopCtr) {
            this.__leftTopCtr.on(Event.TOUCH_START, (e: TouchEvent) => {
                e.stopPropagation();
                console.log(e);
            });
        }
    }

    private __addScript(node: Node2D, material: Material): void {
        const solidColorScript = node.addScript(SolidColor);
        node.width = 10;
        node.height = 10;
        solidColorScript.setMaterial(material);
    }

    protected onUpdate() {
        if (
            !this.__leftTopCtr ||
            !this.__rightBottomCtr ||
            !this.__rightTopCtr ||
            !this.__leftBottomCtr ||
            !this.__hLine1 ||
            !this.__hLine2 ||
            !this.__vLine1 ||
            !this.__vLine2
        ) {
            return;
        }
        this.__leftTopCtr.x = this.node.x - this.node.anchorX * this.node.width;
        this.__leftTopCtr.y =
            this.node.y + (1 - this.node.anchorY) * this.node.height;
        this.__rightTopCtr.x =
            this.node.x + (1 - this.node.anchorX) * this.node.width;
        this.__rightTopCtr.y =
            this.node.y + (1 - this.node.anchorY) * this.node.height;

        this.__leftBottomCtr.x =
            this.node.x - this.node.anchorX * this.node.width;
        this.__leftBottomCtr.y =
            this.node.y - this.node.anchorY * this.node.height;
        this.__rightBottomCtr.x =
            this.node.x + (1 - this.node.anchorX) * this.node.width;
        this.__rightBottomCtr.y =
            this.node.y - this.node.anchorY * this.node.height;

        this.__updateLine();
    }

    private __updateLine(): void {
        if (
            !this.__leftTopCtr ||
            !this.__rightBottomCtr ||
            !this.__rightTopCtr ||
            !this.__leftBottomCtr ||
            !this.__hLine1 ||
            !this.__hLine2 ||
            !this.__vLine1 ||
            !this.__vLine2
        ) {
            return;
        }

        this.__hLine1.x = this.__leftTopCtr.x;
        this.__hLine1.y = this.__leftTopCtr.y;
        this.__hLine1.width = this.__rightTopCtr.x - this.__leftTopCtr.x;
        this.__hLine1.height = DEFAULT_LINE_WIDTH;

        this.__hLine2.x = this.__leftBottomCtr.x;
        this.__hLine2.y = this.__leftBottomCtr.y;
        this.__hLine2.width = this.__rightBottomCtr.x - this.__leftBottomCtr.x;
        this.__hLine2.height = DEFAULT_LINE_WIDTH;

        this.__vLine1.x = this.__leftBottomCtr.x;
        this.__vLine1.y = this.__leftBottomCtr.y;
        this.__vLine1.width = DEFAULT_LINE_WIDTH;
        this.__vLine1.height = this.__leftTopCtr.y - this.__leftBottomCtr.y;

        this.__vLine2.x = this.__rightBottomCtr.x;
        this.__vLine2.y = this.__rightBottomCtr.y;
        this.__vLine2.width = DEFAULT_LINE_WIDTH;
        this.__vLine2.height = this.__rightTopCtr.y - this.__rightBottomCtr.y;
    }
}
