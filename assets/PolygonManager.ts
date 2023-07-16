import { Animation, Component, EventKeyboard, Input, Intersection2D, KeyCode, Node, PolygonCollider2D, Prefab, Vec2, _decorator, input, instantiate } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PolygonManager")
export class PolygonManager extends Component {
    @property({ type: PolygonCollider2D })
    polygon: PolygonCollider2D = null;
    @property({ type: Node })
    polygonHolder: Node = null;
    @property({ type: Prefab })
    prefab: Prefab = null;

    speed: number = 1;
    isMoving: boolean = false;
    movingX: number = 0;
    movingY: number = 0;

    onLoad() {
        for (let index = 0; index < 4; index++) {
            const polygon = instantiate(this.prefab);
            this.polygonHolder.addChild(polygon);
        }
        window["testComp"] = this;
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        this.isMoving = true;
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.movingX = -this.speed;
                break;
            case KeyCode.KEY_W:
                this.movingY = this.speed;
                break;
            case KeyCode.KEY_D:
                this.movingX = this.speed;
                break;
            case KeyCode.KEY_S:
                this.movingY = -this.speed;
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        this.isMoving = false;
        this.movingX = 0;
        this.movingY = 0;
        this.polygon.node.getComponent(Animation).stop();
    }

    checkIntersect() {
        const points = this.polygonHolder.children[0].getComponent(PolygonCollider2D).worldPoints;
        return Intersection2D.pointInPolygon(new Vec2(this.polygon.node.worldPosition.x, this.polygon.node.worldPosition.y), points);
    }

    protected onEnable(): void {}

    protected onDisable(): void {}

    protected onDestroy(): void {}

    protected update(dt: number): void {
        if (this.isMoving) {
            const animationClip = this.polygon.node.getComponent(Animation);
            if (!animationClip.getState("animation").isPlaying) {
                animationClip.play("animation");
            }
            this.polygon.node.setPosition(this.polygon.node.position.x + this.movingX, this.polygon.node.position.y + this.movingY);
        }
        // const isIntersect = this.checkIntersect();
        // if (isIntersect) {
        //     console.log(isIntersect);
        // }
    }
}
