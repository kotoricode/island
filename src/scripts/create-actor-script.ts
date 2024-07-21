import type { Actor } from "../actor"
import { createActor } from "../scene"

export class CreateActorScript
{
    done = false

    constructor(private params: ConstructorParameters<typeof Actor>)
    {
    }

    run(): void
    {
        createActor(...this.params)
        this.done = true
    }
}
