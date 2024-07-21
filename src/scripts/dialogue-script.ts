import { clamp } from "../common"
import { hideDialogueBox, setDialogueTextStyle, setDialogueText, showDialogueBox } from "../dom"
import { takeClick } from "../mouse"
import { getDeltaTime } from "../time"

export class DialogueScript
{
    done = false
    index = -1
    progress = 0
    disableInteract = false

    constructor(
        private texts: string[],
        private style: "narrator-text" | "douche-text" | "bimbo-text",
        options?: {
            disableInteract: boolean
        })
    {
        if (options?.disableInteract)
        {
            this.disableInteract = true
        }
    }

    run(): void
    {
        const oldIndex = this.index

        if (!this.progress)
        {
            this.index++
        }

        const line = this.texts[this.index]

        if (takeClick() && !this.disableInteract)
        {
            if (this.progress === line.length)
            {
                this.progress = 0
                this.index++
            }
            else
            {
                this.progress = line.length
            }
        }

        this.progress = clamp(this.progress + getDeltaTime() * 40, 0, line.length)
        setDialogueTextStyle(this.style)
        setDialogueText(line, this.progress | 0)

        if (oldIndex !== this.index)
        {
            if (!this.index)
            {
                showDialogueBox()
            }
        }

        if (this.texts.length <= this.index)
        {
            hideDialogueBox()
            this.done = true
        }
    }
}
