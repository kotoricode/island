import { attachMouseListeners } from "./mouse"
import { addInitAudioListener } from "./music"
import { render } from "./renderer"
import { addGlobalScript, updateScene } from "./scene"
import { ChangeSceneScript } from "./scripts/change-scene-script"
import { updateTimestamp } from "./time"

function loop(timestamp: number): void
{
    updateTimestamp(timestamp)
    updateScene()
    render()
    requestAnimationFrame(loop)
}

attachMouseListeners()
addInitAudioListener()
requestAnimationFrame(loop)
const firstScene = new ChangeSceneScript("intro")
addGlobalScript(firstScene)
