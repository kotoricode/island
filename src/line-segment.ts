import { Vector2 } from "./vector2"

export class LineSegment
{
    constructor(public start: Vector2, public end: Vector2)
    {
    }

    getIntersection(other: LineSegment): Vector2 | null
    {
        const diffSelf = this.end.clone().subtract(this.start)
        const diffOther = other.end.clone().subtract(other.start)
        const determinant = diffOther.x * diffSelf.y - diffSelf.x * diffOther.y

        if (!determinant)
        {
            return null
        }

        const diffStart = other.start.clone().subtract(this.start)
        const s = (diffOther.x * diffStart.y - diffOther.y * diffStart.x) / determinant

        if (s < 0 || 1 < s)
        {
            return null
        }

        const t = (diffSelf.x * diffStart.y - diffSelf.y * diffStart.x) / determinant

        if (t < 0 || 1 < t)
        {
            return null
        }

        return this.start.clone().mix(this.end, s)
    }
}
