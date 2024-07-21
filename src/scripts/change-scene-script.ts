import { changeScene, Scene } from "../scene"

export class ChangeSceneScript
{
    done = false

    constructor(private key: Scene)
    {
    }

    run(): void
    {
        changeScene(this.key)
        this.done = true
    }
}
