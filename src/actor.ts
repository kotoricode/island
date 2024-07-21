import { lerp, pingpong, Script, smoothstep } from "./common"
import { AnimationId, SpriteAnimation, SpriteId, getSprite } from "./sprite"
import { getRunTime } from "./time"
import { Vector2 } from "./vector2"

export class Actor
{
    name: string
    transform = new DOMMatrix()
    scripts = new Set<Script>()
    speed: number = 65
    highlighted = false
    drawPriority: number | null
    animation: SpriteAnimation | null
    position: Vector2
    offset: Vector2
    pickColor: number | null
    uvRepeat: Vector2
    scale: Vector2
    interactTarget: Actor | null = null
    direction: Vector2 = new Vector2(0, -1)
    interactDistance: number
    isTile: boolean

    constructor(
        public id: string,
        name: string,
        public spriteId: SpriteId,
        options?: Partial<{
            animation: SpriteAnimation
            position: Vector2
            offset: Vector2
            pickColor: number
            uvRepeat: Vector2
            scale: Vector2
            drawPriority: number
            interactDistance: number
            isTile: boolean
        }>
    )
    {
        this.name = name.replace(" ", "\u00A0")
        this.position = options?.position ?? new Vector2()
        this.offset = options?.offset ?? new Vector2()
        this.pickColor = options?.pickColor ?? null
        this.uvRepeat = options?.uvRepeat ?? new Vector2(1, 1)
        this.scale = options?.scale ?? new Vector2(1, 1)
        this.drawPriority = options?.drawPriority ?? null
        this.animation = options?.animation ?? null
        this.interactDistance = options?.interactDistance ?? 0
        this.isTile = options?.isTile ?? false
    }

    getDrawPriority(): number
    {
        return this.drawPriority ?? this.transform.m42
    }

    getHighlightColor(): number
    {
        if (!this.highlighted)
        {
            return 0
        }

        const runTime = getRunTime()
        const min = 0.2
        const max = 0.5
        const speed = 1.5
        const t = smoothstep(pingpong(runTime * speed))

        return lerp(min, max, t)
    }

    setAnimation(animationId: AnimationId | null, options?: { resetTimer: boolean }): void
    {
        if (animationId)
        {
            if (this.animation && !options?.resetTimer)
            {
                this.animation.setAnimation(animationId)
            }
            else
            {
                this.animation = new SpriteAnimation(animationId)
            }

            const frame = this.animation.getCurrentFrame()
            this.spriteId = frame.spriteId
        }
        else
        {
            this.animation = null
        }
    }

    updateAnimation(): void
    {
        if (this.animation)
        {
            this.animation.updateAnimation()
            const frame = this.animation.getCurrentFrame()
            this.spriteId = frame.spriteId
        }
    }

    updateTransform(): void
    {
        const sprite = getSprite(this.spriteId)
        const scale = sprite.size.clone().multiply(this.scale)
        const translation = this.position.clone().add(this.offset).round()

        this.transform.m11 = scale.x
        this.transform.m22 = scale.y
        this.transform.m41 = translation.x
        this.transform.m42 = translation.y
    }

    setMoveAnimation(): void
    {
        let animationId: AnimationId | null = null

        if (this.id === "player")
        {
            if (this.direction.x === 1)
            {
                animationId = "playerRightMove"
            }
            else if (this.direction.x === -1)
            {
                animationId = "playerLeftMove"
            }
            else if (this.direction.y === 1)
            {
                animationId = "playerUpMove"
            }
            else if (this.direction.y === -1)
            {
                animationId = "playerDownMove"
            }
        }
        else if (this.id === "douche")
        {
            if (this.direction.x === 1)
            {
                animationId = "doucheRightMove"
            }
            else if (this.direction.x === -1)
            {
                animationId = "doucheLeftMove"
            }
            else if (this.direction.y === 1)
            {
                animationId = "doucheUpMove"
            }
            else if (this.direction.y === -1)
            {
                animationId = "doucheDownMove"
            }
        }
        else if (this.id === "bimbo")
        {
            if (this.direction.x === 1)
            {
                animationId = "bimboRightMove"
            }
            else if (this.direction.x === -1)
            {
                animationId = "bimboLeftMove"
            }
            else if (this.direction.y === 1)
            {
                animationId = "bimboUpMove"
            }
            else if (this.direction.y === -1)
            {
                animationId = "bimboDownMove"
            }
        }
        else
        {
            console.warn("Not implemented", this.id)
        }

        if (animationId)
        {
            this.setAnimation(animationId)
        }
    }

    stopAnimation(): void
    {
        let animationId: AnimationId | null = null

        if (this.id === "player")
        {
            if (this.direction.x === 1)
            {
                animationId = "playerRightStand"
            }
            else if (this.direction.x === -1)
            {
                animationId = "playerLeftStand"
            }
            else if (this.direction.y === 1)
            {
                animationId = "playerUpStand"
            }
            else if (this.direction.y === -1)
            {
                animationId = "playerDownStand"
            }
        }
        else if (this.id === "douche")
        {
            if (this.direction.x === 1)
            {
                animationId = "doucheRightStand"
            }
            else if (this.direction.x === -1)
            {
                animationId = "doucheLeftStand"
            }
            else if (this.direction.y === 1)
            {
                animationId = "doucheUpStand"
            }
            else if (this.direction.y === -1)
            {
                animationId = "doucheDownStand"
            }
        }
        else if (this.id === "bimbo")
        {
            if (this.direction.x === 1)
            {
                animationId = "bimboRightStand"
            }
            else if (this.direction.x === -1)
            {
                animationId = "bimboLeftStand"
            }
            else if (this.direction.y === 1)
            {
                animationId = "bimboUpStand"
            }
            else if (this.direction.y === -1)
            {
                animationId = "bimboDownStand"
            }
        }
        else
        {
            console.warn("Not implemented", this.id)
        }

        if (animationId)
        {
            this.setAnimation(animationId, { resetTimer: true })
        }
    }
}
