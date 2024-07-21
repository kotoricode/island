import { setCameraBounds } from "../camera"
import { RESOLUTION } from "../dom"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, setPathing, setPlayerActor } from "../scene"
import { SetStateScript } from "../scripts/set-state-script"
import { SpriteAnimation } from "../sprite"
import { state } from "../state"
import { Vector2 } from "../vector2"

export function shack(): void
{
    createActors()
    createPathing()
    createCameraBounds()
    addGlobalScript(new SetStateScript("playerControl", true))
}

function createActors(): void
{
    const player = createActor("player", "You", "playerUpStand", {
        position: new Vector2(16, 8),
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation("playerUpStand")
    })
    createActor("floor", "Floor", "floor", {
        position: new Vector2(-64, -32),
        uvRepeat: new Vector2(5, 3),
        scale: new Vector2(5, 3),
        drawPriority: 9000
    })

    createActor("toJungle", "To jungle", "exitDown", {
        position: new Vector2(0, -32),
        uvRepeat: new Vector2(1, 1),
        scale: new Vector2(1, 1),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    if (state.gatherAtShack && !state.gatherAtCape)
    {
        createActor("douche", "Ryder", "doucheUpStand", {
            position: new Vector2(0, 0),
            offset: new Vector2(-16, -3),
            pickColor: getPickColor(),
            animation: new SpriteAnimation("doucheDownStand"),
            interactDistance: 16
        })

        createActor("bimbo", "Brittany", "bimboDownStand", {
            position: new Vector2(17, 45),
            offset: new Vector2(-16, -3),
            pickColor: getPickColor(),
            animation: new SpriteAnimation("bimboDownStand"),
            interactDistance: 16
        })
    }

    if (!state.hasFlareGun)
    {
        createActor("flareGun", "Flare gun", "flareGun", {
            position: new Vector2(64, 32),
            pickColor: getPickColor(),
            interactDistance: 16
        })
    }

    setPlayerActor(player)
}

function createCameraBounds(): void
{
    const left = -RESOLUTION.x / 2 + 16
    const right = RESOLUTION.x / 2 + 16
    const bottom = -RESOLUTION.y / 2 + 16
    const top = RESOLUTION.y / 2 + 16

    const bottomLeft = new Vector2(left, bottom)
    const bottomRight = new Vector2(right, bottom)
    const topLeft = new Vector2(left, top)
    const topRight = new Vector2(right, top)

    const bounds = new Quad(bottomLeft, bottomRight, topLeft, topRight)
    setCameraBounds(bounds)
}

function createPathing(): void
{
    const left = -RESOLUTION.x / 2
    const right = RESOLUTION.x / 2
    const bottom = -RESOLUTION.y / 2
    const top = RESOLUTION.y / 2

    const vertices = [
        new Vector2(left, bottom),
        new Vector2(right, bottom),
        new Vector2(right, top),
        new Vector2(left, top)
    ]

    const pathing = new Pathing(vertices)

    for (let i = 0; i < vertices.length; i++)
    {
        const start = i
        const end = (i + 1) % vertices.length
        pathing.markOuterSegment(start, end)
    }

    pathing.markQuad(0, 1, 3, 2)

    setPathing(pathing)
}
