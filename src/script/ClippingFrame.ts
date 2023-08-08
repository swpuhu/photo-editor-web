import { Material } from '@simple-render-engine/renderer';
import { Event, TouchEvent } from '@simple-render-engine/renderer/Event';
import { globalEvent } from '@simple-render-engine/renderer/GlobalEvent';
import { Node2D } from '@simple-render-engine/renderer/Node2D';
import { SolidColorMaterial } from '@simple-render-engine/renderer/material/SolidColorMaterial';
import { EngineScript } from '@simple-render-engine/renderer/script/EngineScript';
import { SolidColor } from '@simple-render-engine/renderer/script/SolidColor';
import { createHierarchyTree } from '@simple-render-engine/renderer/script/util';
import {
    ClippingInfoInterface,
    SizeInterface,
    Vec2Interface,
} from '@simple-render-engine/renderer/util';
import { round } from 'lodash';
const DEFAULT_LINE_WIDTH = 2;

type CtrlButtonType = 'lt' | 'rt' | 'lb' | 'rb' | 'move' | '';

const ADJUST_END = 'adjust_end';
export class ClippingFrame extends EngineScript {
    static ADJUST_END: typeof ADJUST_END = ADJUST_END;
    private __leftTopCtr: Node2D | null = null;
    private __rightTopCtr: Node2D | null = null;
    private __leftBottomCtr: Node2D | null = null;
    private __rightBottomCtr: Node2D | null = null;
    private __hLine1: Node2D | null = null;
    private __hLine2: Node2D | null = null;
    private __vLine1: Node2D | null = null;
    private __vLine2: Node2D | null = null;

    private __controlNode: Node2D | null = null;
    private __startSize: SizeInterface = { width: 0, height: 0 };
    private __startPos: Vec2Interface = { x: 0, y: 0 };
    private __prevRightTop: Vec2Interface = { x: 0, y: 0 };
    private __prevLeftBottom: Vec2Interface = { x: 0, y: 0 };
    private __touchingButton: CtrlButtonType = '';
    declare node: Node2D;
    protected onLoad(): void {
        const ctrlMaterial = new SolidColorMaterial();
        ctrlMaterial.setProperty('u_color', [0.0, 0.5, 1.0, 1.0]);
        const hierarchyTree = createHierarchyTree([
            {
                name: 'center-clippingFrame',
                options: {
                    ref: 'center',
                },
            },
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
            center: center,
        } = hierarchyTree;

        this.__leftTopCtr = __leftTopCtr;
        this.__rightTopCtr = __rightTopCtr;
        this.__leftBottomCtr = __leftBottomCtr;
        this.__rightBottomCtr = __rightBottomCtr;

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

        this.__addScript(center, ctrlMaterial);

        this.node.addChildren(
            this.__leftTopCtr,
            this.__rightTopCtr,
            this.__leftBottomCtr,
            this.__rightBottomCtr,
            this.__hLine1,
            this.__hLine2,
            this.__vLine1,
            this.__vLine2,
            center
        );
        this.__bindEvents();
    }

    private __bindEvents(): void {
        this.__bindTouchStartEvent(this.node, 'move');
        if (this.__leftTopCtr) {
            this.__bindTouchStartEvent(this.__leftTopCtr, 'lt');
        }
        if (this.__leftBottomCtr) {
            this.__bindTouchStartEvent(this.__leftBottomCtr, 'lb');
        }
        if (this.__rightTopCtr) {
            this.__bindTouchStartEvent(this.__rightTopCtr, 'rt');
        }
        if (this.__rightBottomCtr) {
            this.__bindTouchStartEvent(this.__rightBottomCtr, 'rb');
        }
    }

    private __bindTouchStartEvent(node: Node2D, type: CtrlButtonType) {
        node.on(Event.TOUCH_START, (e: TouchEvent) => {
            this.__touchingButton = type;
            this.__onTouchStart(e);
        });
    }

    private __onTouchStart(e: TouchEvent): void {
        e.stopPropagation();
        this.__startSize.width = this.node.width;
        this.__startSize.height = this.node.height;
        switch (this.__touchingButton) {
            case 'lt':
                this.__startPos = this.node.convertToWorldSpace({
                    x: this.__leftTopCtr!.x,
                    y: this.__leftTopCtr!.y,
                });
                break;
            case 'lb':
                this.__startPos = this.node.convertToWorldSpace({
                    x: this.__leftBottomCtr!.x,
                    y: this.__leftBottomCtr!.y,
                });
                break;
            case 'rt':
                this.__startPos = this.node.convertToWorldSpace({
                    x: this.__rightTopCtr!.x,
                    y: this.__rightTopCtr!.y,
                });
                break;
            case 'rb':
                this.__startPos = this.node.convertToWorldSpace({
                    x: this.__rightBottomCtr!.x,
                    y: this.__rightBottomCtr!.y,
                });
                break;
            case 'move':
                this.__startPos = this.node.position;
                break;
        }
        this.__prevLeftBottom = this.node.convertToWorldSpace(
            this.__leftBottomCtr!.position
        );
        this.__prevRightTop = this.node.convertToWorldSpace(
            this.__rightTopCtr!.position
        );

        globalEvent.on(Event.TOUCHING, this.__onTouching, this);
        globalEvent.on(Event.TOUCH_END, this.__onTouchEnd, this);
    }

    private __onTouching(e: TouchEvent): void {
        const { delta } = e;
        const currentX = this.__startPos.x + delta.x;
        const currentY = this.__startPos.y + delta.y;
        switch (this.__touchingButton) {
            case 'lt':
                this.__updateByVertPos(
                    {
                        x: currentX,
                        y: this.__prevLeftBottom.y,
                    },
                    {
                        x: this.__prevRightTop.x,
                        y: currentY,
                    }
                );
                break;
            case 'lb':
                this.__updateByVertPos(
                    { x: currentX, y: currentY },
                    this.__prevRightTop
                );
                break;
            case 'rt':
                this.__updateByVertPos(this.__prevLeftBottom, {
                    x: currentX,
                    y: currentY,
                });
                break;
            case 'rb':
                this.__updateByVertPos(
                    {
                        x: this.__prevLeftBottom.x,
                        y: currentY,
                    },
                    {
                        x: currentX,
                        y: this.__prevRightTop.y,
                    }
                );
                break;
            case 'move':
                this.node.x = currentX;
                this.node.y = currentY;
                break;
        }
    }

    private __onTouchEnd(e: TouchEvent): void {
        globalEvent.off(Event.TOUCHING, this.__onTouching, this);
        globalEvent.off(Event.TOUCH_END, this.__onTouchEnd, this);
        this.emit(ClippingFrame.ADJUST_END);
    }

    private __addScript(node: Node2D, material: Material): void {
        const solidColorScript = node.addScript(SolidColor);
        node.width = 10;
        node.height = 10;
        solidColorScript.setMaterial(material);
    }

    public getClippingInfo(): ClippingInfoInterface | null {
        if (!this.__controlNode) {
            return null;
        }
        const controlNodeRect = this.__controlNode.getWorldRect();
        const frameRect = this.node.getWorldRect();

        const left = (frameRect.x - controlNodeRect.x) / controlNodeRect.width;
        const bottom =
            (frameRect.y - controlNodeRect.y) / controlNodeRect.height;
        const right =
            (controlNodeRect.x +
                controlNodeRect.width -
                frameRect.x -
                frameRect.width) /
            controlNodeRect.width;
        const top =
            (controlNodeRect.y +
                controlNodeRect.height -
                frameRect.y -
                frameRect.height) /
            controlNodeRect.height;

        return {
            left: round(left, 5),
            right: round(right, 5),
            top: round(top, 5),
            bottom: round(bottom, 5),
        };
    }

    public adaptToNode(
        node: Node2D,
        clippingInfo?: ClippingInfoInterface
    ): void {
        const worldRect = node.getWorldRect();
        this.__controlNode = node;
        const { x, y, width, height } = worldRect;
        let left, top, right, bottom;
        left = top = right = bottom = 0;
        if (clippingInfo) {
            left = clippingInfo.left;
            right = clippingInfo.right;
            top = clippingInfo.top;
            bottom = clippingInfo.bottom;
        }
        this.__updateByVertPos(
            { x: x + width * left, y: y + height * bottom },
            {
                x: x + width - width * right,
                y: y + height - height * top,
            }
        );
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
        this.__leftTopCtr.x = -this.node.anchorX * this.node.width;
        this.__leftTopCtr.y = (1 - this.node.anchorY) * this.node.height;
        this.__rightTopCtr.x = (1 - this.node.anchorX) * this.node.width;
        this.__rightTopCtr.y = (1 - this.node.anchorY) * this.node.height;

        this.__leftBottomCtr.x = -this.node.anchorX * this.node.width;
        this.__leftBottomCtr.y = -this.node.anchorY * this.node.height;
        this.__rightBottomCtr.x = (1 - this.node.anchorX) * this.node.width;
        this.__rightBottomCtr.y = -this.node.anchorY * this.node.height;

        this.__updateLine();
    }

    private __updateByVertPos(
        lbWorld: Vec2Interface,
        rtWorld: Vec2Interface
    ): void {
        const left = lbWorld.x;
        const top = rtWorld.y;
        const right = rtWorld.x;
        const bottom = lbWorld.y;

        const width = right - left;
        const height = top - bottom;
        if (width <= 0 || height <= 0) {
            return;
        }
        this.node.width = width;
        this.node.height = height;
        const localPos = this.node.parent!.convertToNodeSpace({
            x: left + width * this.node.anchorX,
            y: bottom + height * this.node.anchorY,
        });

        this.node.x = localPos.x;
        this.node.y = localPos.y;
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
