import { Vector2 } from "./vector2"

export class Quad
{
    left: number
    right: number
    bottom: number
    top: number

    constructor(
        public bottomLeft: Vector2,
        public bottomRight: Vector2,
        public topLeft: Vector2,
        public topRight: Vector2
    )
    {
        this.left = bottomLeft.x
        this.right = topRight.x
        this.bottom = bottomRight.y
        this.top = topRight.y
    }

    contains(point: Vector2): boolean
    {
        return this.left <= point.x && point.x <= this.right
            && this.bottom <= point.y && point.y <= this.top
    }
}
