import { playMusic } from "../music"

export class PlayMusicScript
{
    done = false

    constructor(private filename: string)
    {
    }

    run(): void
    {
        playMusic(this.filename)
        this.done = true
    }
}
