import { removeActor } from "../scene"

export class RemoveActorScript
{
    done = false

    constructor(private actorId: string)
    {
    }

    run(): void
    {
        removeActor(this.actorId)
        this.done = true
    }
}
