import { Actor } from "../actor"
import { getDeltaTime } from "../time"
import { Vector2 } from "../vector2"

export class MoveScript
{
    done = false
    path: Vector2[]
    maxDistance: number

    constructor(
        private actor: Actor,
        path: Vector2[],
        options?: {
            useReference: boolean,
            maxDistance: number
        }
    )
    {
        this.path = options?.useReference ? path.slice() : path.map(target => target.clone())
        this.maxDistance = options?.maxDistance ?? 0
    }

    run(): void
    {
        const deltaTime = getDeltaTime()
        let movementLeft = this.actor.speed * deltaTime

        while (true)
        {
            if (!this.path.length)
            {
                this.actor.stopAnimation()
                this.done = true

                return
            }

            const target = this.path[0]
            const distance = this.actor.position.distance(target)

            if (this.path.length === 1 && distance <= this.maxDistance)
            {
                this.path.shift()
                this.actor.stopAnimation()
                this.done = true

                return
            }

            const diff = target.clone().subtract(this.actor.position)

            if (!diff.magnitude())
            {
                this.path.shift()

                continue
            }

            const movement = diff.normalize().multiplyScalar(movementLeft)
            this.actor.direction = movement.getDirection()

            if (movementLeft < distance)
            {
                this.actor.position.add(movement)
                this.actor.setMoveAnimation()

                return
            }

            this.path.shift()
            movementLeft -= distance
            this.actor.position.copy(target)
        }
    }
}
