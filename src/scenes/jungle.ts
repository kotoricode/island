import { setCameraBounds } from "../camera"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, previousScene, setPathing, setPlayerActor } from "../scene"
import { DialogueScript } from "../scripts/dialogue-script"
import { MoveScript } from "../scripts/move-script"
import { ParallelScript } from "../scripts/parallel-script"
import { SerialScript } from "../scripts/serial-scripts"
import { SetStateScript } from "../scripts/set-state-script"
import { WaitScript } from "../scripts/wait-script"
import { AnimationId, SpriteAnimation, SpriteId } from "../sprite"
import { state } from "../state"
import { Vector2 } from "../vector2"

export function jungle(): void
{
    createActors()
    createPathing()
    createCameraBounds()
    addGlobalScript(new SetStateScript("playerControl", true))
}

function createActors(): void
{
    let playerPosition: Vector2
    let playerSpriteId: SpriteId
    let playerAnimationId: AnimationId

    if (previousScene === "shack")
    {
        playerPosition = new Vector2(-162 + 16, 80-32-8)
        playerSpriteId = "playerDownStand"
        playerAnimationId = "playerDownStand"
    }
    else
    {
        playerPosition = new Vector2(32 + 16, 8)
        playerSpriteId = "playerUpStand"
        playerAnimationId = "playerUpStand"
    }

    const player = createActor("player", "You", playerSpriteId, {
        position: playerPosition,
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation(playerAnimationId)
    })
    createActor("grass", "Grass", "grass", {
        offset: new Vector2(-50 * 32, -50 * 32),
        uvRepeat: new Vector2(100, 100),
        scale: new Vector2(100, 100),
        drawPriority: 9000
    })

    createActor("shack", "Shack", "shack", {
        position: new Vector2(-240, 80)
    })

    createActor("toShipwreck", "To shipwreck", "exitDown", {
        position: new Vector2(0, -32),
        uvRepeat: new Vector2(3, 1),
        scale: new Vector2(3, 1),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    createActor("toShack", "To shack", "exitUp", {
        position: new Vector2(-162, 80-32),
        uvRepeat: new Vector2(1, 1),
        scale: new Vector2(1, 1),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    createActor("tree", "Tree", "tree", { position: new Vector2(-45, -145) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-120, -153) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-187, -150) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-231, -141) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-290, -155) })

    createActor("plants", "Plants", "plants", { position: new Vector2(-14, 170), drawPriority: 6000 })
    createActor("plants", "Plants", "plants", { position: new Vector2(100, 100), drawPriority: 6000 })
    createActor("plants", "Plants", "plants", { position: new Vector2(-10, 80), drawPriority: 6000 })
    createActor("plants", "Plants", "plants", { position: new Vector2(-200, 10), drawPriority: 6000 })
    createActor("plants", "Plants", "plants", { position: new Vector2(-120, 20), drawPriority: 6000 })
    createActor("plants", "Plants", "plants", { position: new Vector2(-22, 15), drawPriority: 6000 })

    setPlayerActor(player)

    if (state.doucheFoundAllTuna)
    {
        if (!state.gatherAtJungle)
        {
            partyFindsShack()
        }
        else if (!state.gatherAtCape && !state.gatherAtShack)
        {
            createActor("douche", "Ryder", "doucheDownStand", {
                position: new Vector2(-27, 81),
                offset: new Vector2(-16, -3),
                pickColor: getPickColor(),
                animation: new SpriteAnimation("doucheDownStand"),
                interactDistance: 16
            })

            createActor("bimbo", "Brittany", "bimboDownStand", {
                position: new Vector2(67, 78),
                offset: new Vector2(-16, -3),
                pickColor: getPickColor(),
                animation: new SpriteAnimation("bimboDownStand"),
                interactDistance: 16
            })
        }

        if (!state.hasTorch)
        {
            createActor("torch", "Torch", "torch", {
                position: new Vector2(70, 166),
                pickColor: getPickColor(),
                offset: new Vector2(-16, -16),
                interactDistance: 32
            })
        }

        if (state.firePlaced)
        {
            createActor("fire", "Fire", "fire1", {
                position: new Vector2(18, 113),
                offset: new Vector2(-16, -16),
                animation: new SpriteAnimation("fire")
            })

            if (!state.hasKey)
            {
                createActor("key", "Glimmer", "glimmer1", {
                    position: new Vector2(73, 150),
                    offset: new Vector2(-16, -16),
                    animation: new SpriteAnimation("glimmer"),
                    pickColor: getPickColor()
                })
            }
        }
    }
}

function createCameraBounds(): void
{
    const left = -260
    const right = 128
    const bottom = -64
    const top = 200

    const bottomLeft = new Vector2(left, bottom)
    const bottomRight = new Vector2(right, bottom)
    const topLeft = new Vector2(left, top)
    const topRight = new Vector2(right, top)

    const bounds = new Quad(bottomLeft, bottomRight, topLeft, topRight)
    setCameraBounds(bounds)
}

function createPathing(): void
{
    const left = -226
    const right = 96
    const bottom = -32
    const top = 170

    const shackRight = -47
    const shackBottom = 80

    const vertices = [
        new Vector2(left, bottom),
        new Vector2(shackRight, bottom),
        new Vector2(right, bottom),
        new Vector2(right, shackBottom),
        new Vector2(right, top),
        new Vector2(shackRight, top),
        new Vector2(shackRight, shackBottom),
        new Vector2(left, shackBottom)
    ]

    const pathing = new Pathing(vertices)

    for (let i = 0; i < vertices.length; i++)
    {
        const start = i
        const end = (i + 1) % vertices.length
        pathing.markOuterSegment(start, end)
    }

    pathing.markQuad(0, 1, 7, 6)
    pathing.markQuad(1, 2, 6, 3)
    pathing.markQuad(6, 3, 5, 4)

    setPathing(pathing)
}

function partyFindsShack(): void
{
    const douche = createActor("douche", "Ryder", "doucheUpStand", {
        position: new Vector2(100, -150),
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation("doucheUpStand"),
        interactDistance: 16
    })

    const bimbo = createActor("bimbo", "Brittany", "bimboUpStand", {
        position: new Vector2(60, -150),
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation("bimboUpStand"),
        interactDistance: 16
    })

    const doucheScripts = [
        new MoveScript(douche, [
            new Vector2(6, 12)
        ]),
        new WaitScript(1.5),
        new DialogueScript([
            "Now what do we have here..."
        ], "douche-text"),
        new WaitScript(1.5),
        new MoveScript(douche, [
            new Vector2(-120, 19),
            new Vector2(-146, 75)
        ]),
        new WaitScript(3),
        new MoveScript(douche, [
            new Vector2(21, 11)
        ]),
        new DialogueScript([
            "The shack's locked.",
            "Shame. Would have made for good shelter."
        ], "douche-text")
    ]

    const bimboScripts = [
        new WaitScript(3),
        new MoveScript(bimbo, [
            new Vector2(76, 43)
        ]),
        new WaitScript(2.5),
        new MoveScript(bimbo, [
            new Vector2(75.99, 43)
        ])
    ]

    const parallel = new ParallelScript([
        new SerialScript(doucheScripts),
        new SerialScript(bimboScripts)
    ])

    addGlobalScript(new SetStateScript("playerControl", false))
    addGlobalScript(parallel)
    addGlobalScript(new SetStateScript("gatherAtJungle", true))
    addGlobalScript(new SetStateScript("playerControl", true))
}
