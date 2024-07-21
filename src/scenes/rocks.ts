import { setCameraBounds } from "../camera"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, previousScene, setPathing, setPlayerActor } from "../scene"
import { SetStateScript } from "../scripts/set-state-script"
import { SpriteAnimation } from "../sprite"
import { state } from "../state"
import { Vector2 } from "../vector2"

export function rocks(): void
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
        playerPosition = new Vector2(32 + 16, 16)
    }
    else
    {
        playerPosition = new Vector2(48, 216)
    }

    const player = createActor("player", "You", "playerRightStand", {
        position: playerPosition,
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation("playerRightStand")
    })

    for (let i = 0; i < 13; i++)
    {
        const x = (i % 2) * 32 - 16
        const y = i * 20 - 32

        createActor("boulder", "Boulder", "boulder", {
            position: new Vector2(x, y),
            drawPriority: 6000 + i
        })
    }

    createActor("water", "Water", "water1", {
        offset: new Vector2(-1600, -1600),
        uvRepeat: new Vector2(100, 100),
        scale: new Vector2(100, 100),
        drawPriority: 9000,
        animation: new SpriteAnimation("water")
    })
    createActor("toShipwreck", "To shipwreck", "exitLeft", {
        drawPriority: 5000,
        pickColor: getPickColor(),
        isTile: true
    })
    createActor("toCape", "To cape", "exitLeft", {
        position: new Vector2(0, 200),
        drawPriority: 5000,
        pickColor: getPickColor(),
        isTile: true
    })

    if (state.doucheIntro && !state.hasRocksTuna)
    {
        createActor("rocksTuna", "Tuna", "tuna", {
            offset: new Vector2(-16, -16),
            position: new Vector2(64, 120),
            pickColor: getPickColor(),
            interactDistance: 16
        })
    }

    if (state.hasTorch && !state.hasFlint)
    {
        createActor("flint", "Flint", "flint", {
            position: new Vector2(70, 217),
            pickColor: getPickColor(),
            offset: new Vector2(-16, -8),
            interactDistance: 32
        })
    }

    setPlayerActor(player)
}

function createCameraBounds(): void
{
    const left = 0
    const right = Infinity
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
        new Vector2(0, 0),
        new Vector2(90, 0),
        new Vector2(90, 232),
        new Vector2(0, 232)
    ])

    pathing.markQuad(0, 1, 3, 2)
    pathing.markOuterSegment(0, 1)
    pathing.markOuterSegment(0, 2)
    pathing.markOuterSegment(2, 3)

    setPathing(pathing)
}

