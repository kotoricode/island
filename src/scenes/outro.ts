import { addGlobalScript } from "../scene"
import { ChangeSceneScript } from "../scripts/change-scene-script"
import { DialogueScript } from "../scripts/dialogue-script"
import { FadeScript } from "../scripts/fade-script"
import { PlayMusicScript } from "../scripts/play-music-script"
import { WaitScript } from "../scripts/wait-script"

export function outro(): void
{
    const wait = new WaitScript(0.5)
    const dialogue = new DialogueScript([
        "...",
        "The cruise ship you were on has sank during its voyage.",
        "You have washed ashore on a small, desolate island, along with a few other passengers.",
        "Find a way to alert rescuers to your location."
    ], "narrator-text")
    const wreckScene = new ChangeSceneScript("shipwreck")
    const music = new PlayMusicScript("001.ogg")
    const fade = new FadeScript(-2)

    addGlobalScript(wait)
    addGlobalScript(dialogue)
    addGlobalScript(wreckScene)
    addGlobalScript(fade)
    addGlobalScript(music)
}
