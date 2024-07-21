import { setCameraBounds } from "../camera"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, previousScene, setPathing, setPlayerActor } from "../scene"
import { SetStateScript } from "../scripts/set-state-script"
import { SpriteAnimation } from "../sprite"
import { state } from "../state"
import { Vector2 } from "../vector2"

export function westBeach(): void
{
    createActors()
    createPathing()
    createCameraBounds()
    addGlobalScript(new SetStateScript("playerControl", true))
}

function createActors(): void
{
    let playerPosition: Vector2

    if (previousScene === "shipwreck")
    {
        playerPosition = new Vector2(-16, 16)
    }
    else
    {
        playerPosition = new Vector2(-16, 17 * 32 + 16)
    }

    const player = createActor("player", "You", "playerLeftStand", {
        position: playerPosition,
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation("playerLeftStand")
    })
    createActor("sand", "Sand", "sand", {
        position: new Vector2(-96, -32),
        uvRepeat: new Vector2(4, 20),
        scale: new Vector2(4, 20),
        drawPriority: 8000
    })
    createActor("water", "Water", "water1", {
        offset: new Vector2(-1600, -1600),
        uvRepeat: new Vector2(100, 100),
        scale: new Vector2(100, 100),
        drawPriority: 9000,
        animation: new SpriteAnimation("water")
    })
    createActor("toShipwreck", "To shipwreck", "exitRight", {
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })
    createActor("toCape", "To cape", "exitRight", {
        position: new Vector2(0, 17 * 32),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    if (state.doucheIntro && !state.hasWestBeachTuna)
    {
        createActor("westBeachTuna", "Tuna", "tuna", {
            offset: new Vector2(-16, -16),
            position: new Vector2(-94, 300),
            pickColor: getPickColor(),
            interactDistance: 16
        })
    }

    setPlayerActor(player)
}

function createCameraBounds(): void
{
    const left = -96
    const right = 32
    const bottom = -Infinity
    const top = Infinity

    const bottomLeft = new Vector2(left, bottom)
    const bottomRight = new Vector2(right, bottom)
    const topLeft = new Vector2(left, top)
    const topRight = new Vector2(right, top)

    const bounds = new Quad(bottomLeft, bottomRight, topLeft, topRight)
    setCameraBounds(bounds)
}

function createPathing(): void
{
    const pathing = new Pathing([
        new Vector2(-96, -32),
        new Vector2(32, -32),
        new Vector2(32, 608),
        new Vector2(-96, 608)
    ])

    pathing.markQuad(0, 1, 3, 2)
    pathing.markOuterSegment(0, 1)
    pathing.markOuterSegment(0, 3)
    pathing.markOuterSegment(2, 3)

    setPathing(pathing)
}
