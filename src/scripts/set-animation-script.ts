import { getActor } from "../scene"
import { AnimationId } from "../sprite"

export class SetAnimationScript
{
    done = false

    constructor(private actorId: string, private animationId: AnimationId | null)
    {
    }

    run(): void
    {
        const actor = getActor(this.actorId)

        if (actor)
        {
            actor.setAnimation(this.animationId)
        }

        this.done = true
    }
}
