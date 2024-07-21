export class Vector2
{
    constructor(public x = 0, public y = 0)
    {
    }

    add(value: Vector2): this
    {
        this.x += value.x
        this.y += value.y

        return this
    }

    clone(): Vector2
    {
        return new Vector2(this.x, this.y)
    }

    copy(value: Vector2): void
    {
        this.x = value.x
        this.y = value.y
    }

    divide(value: Vector2): this
    {
        this.x /= value.x
        this.y /= value.y

        return this
    }

    divideScalar(value: number): this
    {
        this.x /= value
        this.y /= value

        return this
    }

    distance(value: Vector2): number
    {
        const x = this.x - value.x
        const y = this.y - value.y

        return (x ** 2 + y ** 2) ** 0.5
    }

    magnitude(): number
    {
        return (this.x ** 2 + this.y ** 2) ** 0.5
    }

    multiply(value: Vector2): this
    {
        this.x *= value.x
        this.y *= value.y

        return this
    }

    multiplyScalar(value: number): this
    {
        this.x *= value
        this.y *= value

        return this
    }

    normalize(): this
    {
        const length = this.magnitude()

        if (!length)
        {
            console.warn("Normalize called for zero vector")
        }

        this.divideScalar(length)

        return this
    }

    subtract(value: Vector2): this
    {
        this.x -= value.x
        this.y -= value.y

        return this
    }

    round(): this
    {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)

        return this
    }

    getDirection(): Vector2
    {
        if (this.x === 0 && this.y === 0)
        {
            return new Vector2(0, 0)
        }

        if (Math.abs(this.x) > Math.abs(this.y))
        {
            return new Vector2(Math.sign(this.x), 0)
        }

        return new Vector2(0, Math.sign(this.y))
    }

    mix(other: Vector2, t: number): this
    {
        this.x += (other.x - this.x) * t
        this.y += (other.y - this.y) * t

        return this
    }
}
