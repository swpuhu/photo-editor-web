import { Material, Node } from '../../submodule/renderer';
import { Node2D } from '../../submodule/renderer/Node2D';
import { SolidColorMaterial } from '../../submodule/renderer/material/SolidColorMaterial';
import { EngineScript } from '../../submodule/renderer/script/EngineScript';
import { SolidColor } from '../../submodule/renderer/script/SolidColor';

export class ClippingFrame extends EngineScript {
    private __leftTopCtr: Node2D | null = null;
    private __rightTopCtr: Node2D | null = null;
    private __leftBottomCtr: Node2D | null = null;
    private __rightBottomCtr: Node2D | null = null;
    protected onLoad(): void {
        const ctrlMaterial = new SolidColorMaterial();
        this.__leftTopCtr = new Node2D('left-top');
        this.__rightTopCtr = new Node2D('right-top');
        this.__leftBottomCtr = new Node2D('left-bottom');
        this.__rightBottomCtr = new Node2D('right-bottom');

        this.__addScript(this.__leftTopCtr, ctrlMaterial);
        this.__addScript(this.__rightTopCtr, ctrlMaterial);
        this.__addScript(this.__leftBottomCtr, ctrlMaterial);
        this.__addScript(this.__rightBottomCtr, ctrlMaterial);

        this.node.addChildren(
            this.__leftTopCtr,
            this.__rightTopCtr,
            this.__leftBottomCtr,
            this.__rightBottomCtr
        );
    }

    private __addScript(node: Node2D, material: Material): void {
        const solidColorScript = node.addScript(SolidColor);
        node.width = 100;
        node.height = 100;
        solidColorScript.setMaterial(material);
    }
}
