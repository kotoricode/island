import { getDeltaTime } from "../time"

export class WaitScript
{
    done = false
    elapsed = 0

    constructor(private duration: number)
    {
    }

    run(): void
    {
        this.elapsed += getDeltaTime()
        this.done = this.elapsed > this.duration
    }
}
