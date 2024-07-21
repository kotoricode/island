import { Script } from "../common"

export class SerialScript
{
    done = false

    constructor(private scripts: Script[])
    {
    }

    run(): void
    {
        for (const script of this.scripts)
        {
            if (script.done)
            {
                continue
            }

            script.run()

            if (!script.done)
            {
                return
            }
        }

        this.done = true
    }
}
