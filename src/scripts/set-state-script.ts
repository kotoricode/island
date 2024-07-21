import { state } from "../state"

export class SetStateScript<StateKey extends keyof typeof state>
{
    done = false

    constructor(private key: StateKey, private value: typeof state[StateKey])
    {
    }

    run(): void
    {
        state[this.key] = this.value
        this.done = true
    }
}
