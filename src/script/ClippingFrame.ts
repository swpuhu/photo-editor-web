import { Material } from '@simple-render-engine/renderer';
import { Event, TouchEvent } from '@simple-render-engine/renderer/Event';
import { Node2D } from '@simple-render-engine/renderer/Node2D';
import { SolidColorMaterial } from '@simple-render-engine/renderer/material/SolidColorMaterial';
import { EngineScript } from '@simple-render-engine/renderer/script/EngineScript';
import { SolidColor } from '@simple-render-engine/renderer/script/SolidColor';
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
        this.__leftTopCtr = new Node2D('left-top');
        this.__rightTopCtr = new Node2D('right-top');
        this.__leftBottomCtr = new Node2D('left-bottom');
        this.__rightBottomCtr = new Node2D('right-bottom');

        this.__hLine1 = new Node2D('h-line1', { anchorX: 0 });
        this.__hLine2 = new Node2D('h-line2', { anchorX: 0 });
        this.__vLine1 = new Node2D('v-line1', { anchorX: 0 });
        this.__vLine2 = new Node2D('v-line2', { anchorX: 0 });

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
            this.__hLine1
        );
        this.__bindEvents();
    }

    private __bindEvents(): void {
        this.node.on(Event.TOUCH, (e) => {
            console.log('clipping frame', e);
        });

        if (this.__leftTopCtr) {
            this.__leftTopCtr.on(Event.TOUCH, (e: TouchEvent) => {
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

        this.__hLine1.x = this.__leftTopCtr.x;
        this.__hLine1.y = this.__leftTopCtr.y;
        this.__hLine1.width = this.__rightTopCtr.x - this.__leftTopCtr.x;
        this.__hLine1.height = DEFAULT_LINE_WIDTH;
    }
}
