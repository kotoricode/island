import { clamp } from "../common"
import { state } from "../state"
import { getDeltaTime } from "../time"

export class FadeScript
{
    done = false

    constructor(private strength: number)
    {
    }

    run(): void
    {
        const step = this.strength * getDeltaTime()
        state.fadeFactor = clamp(state.fadeFactor + step, 0, 1)
        this.done = state.fadeFactor === 0 || state.fadeFactor === 1
    }
}
