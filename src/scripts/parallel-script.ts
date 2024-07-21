import { Script } from "../common"

export class ParallelScript
{
    done = false

    constructor(private scripts: Script[])
    {
    }

    run(): void
    {
        for (const script of this.scripts)
        {
            if (!script.done)
            {
                script.run()
            }
        }

        this.done = this.scripts.every(script => script.done)
    }
}
