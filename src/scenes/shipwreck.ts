import { setCameraBounds } from "../camera"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, previousScene, setPathing, setPlayerActor } from "../scene"
import { SetStateScript } from "../scripts/set-state-script"
import { AnimationId, SpriteAnimation, SpriteId } from "../sprite"
import { getFoundTunaCount, state } from "../state"
import { Vector2 } from "../vector2"

export function shipwreck(): void
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

    if (previousScene === "jungle")
    {
        playerPosition = new Vector2(-16, -8)
        playerSpriteId = "playerDownStand"
        playerAnimationId = "playerDownStand"
    }
    else if (previousScene === "westBeach")
    {
        playerPosition = new Vector2(-288 + 16, -64 + 16)
        playerSpriteId = "playerRightStand"
        playerAnimationId = "playerRightStand"
    }
    else if (previousScene === "rocks")
    {
        playerPosition = new Vector2(270, -52)
        playerSpriteId = "playerLeftStand"
        playerAnimationId = "playerLeftStand"
    }
    else
    {
        playerPosition = new Vector2(32, -96)
        playerSpriteId = "playerDownStand"
        playerAnimationId = "playerDownStand"
    }

    const player = createActor("player", "You", playerSpriteId, {
        position: playerPosition,
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation(playerAnimationId)
    })
    createActor("boulder", "Boulder", "boulder", {
        position: new Vector2(120, 2)
    })
    createActor("sand", "Sand", "sand", {
        scale: new Vector2(20, 7),
        uvRepeat: new Vector2(20, 7),
        offset: new Vector2(-10 * 32, -4 * 32),
        drawPriority: 8000
    })
    createActor("grass", "Grass", "grass", {
        position: new Vector2(-10 * 32, 32),
        uvRepeat: new Vector2(8, 2),
        scale: new Vector2(8, 2),
        drawPriority: 8000
    })
    createActor("grass", "Grass", "grass", {
        position: new Vector2(32, 32),
        uvRepeat: new Vector2(9, 2),
        scale: new Vector2(9, 2),
        drawPriority: 8000
    })
    createActor("grass", "Grass", "grass", {
        position: new Vector2(96, 0),
        uvRepeat: new Vector2(4, 1),
        scale: new Vector2(4, 1),
        drawPriority: 8000
    })
    createActor("water", "Water", "water1", {
        offset: new Vector2(-50 * 32, -50 * 32),
        uvRepeat: new Vector2(100, 100),
        scale: new Vector2(100, 100),
        drawPriority: 9000,
        animation: new SpriteAnimation("water")
    })

    createActor("toWestBeach", "To west beach", "exitLeft", {
        position: new Vector2(-10 * 32, -3 * 32),
        uvRepeat: new Vector2(1, 3),
        scale: new Vector2(1, 3),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })
    createActor("toJungle", "To jungle", "exitUp", {
        position: new Vector2(-64, 0),
        uvRepeat: new Vector2(3, 1),
        scale: new Vector2(3, 1),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })
    createActor("toRocks", "To rocks", "exitRight", {
        position: new Vector2(9 * 32, -3 * 32),
        uvRepeat: new Vector2(1, 3),
        scale: new Vector2(1, 3),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    createActor("tree", "Tree", "tree", { position: new Vector2(-145, 55) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-190, 41) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-254, 53) })
    createActor("tree", "Tree", "tree", { position: new Vector2(-300, 50) })

    createActor("bush", "Bush", "bush", { position: new Vector2(-145, 47) })
    createActor("bush", "Bush", "bush", { position: new Vector2(-250, 35) })
    createActor("bush", "Bush", "bush", { position: new Vector2(-300, 46) })

    createActor("tree", "Tree", "tree", { position: new Vector2(45, 55) })
    createActor("tree", "Tree", "tree", { position: new Vector2(120, 53) })
    createActor("tree", "Tree", "tree", { position: new Vector2(187, 50) })
    createActor("tree", "Tree", "tree", { position: new Vector2(231, 41) })
    createActor("tree", "Tree", "tree", { position: new Vector2(290, 55) })

    createActor("bush", "Bush", "bush", { position: new Vector2(45, 47) })
    createActor("bush", "Bush", "bush", { position: new Vector2(150, 35) })
    createActor("bush", "Bush", "bush", { position: new Vector2(200, 46) })

    setPlayerActor(player)

    if (state.gatherAtJungle)
    {
        return
    }

    const tuna = getFoundTunaCount()
    const bimboSex = tuna === 2 && !state.witnessSexBimbo
    const bimboCum = tuna === 3 || (tuna === 2 && state.witnessSexBimbo)

    if (bimboSex)
    {
        createActor("sexBimbo", "???", "sexBimbo1", {
            position: new Vector2(113, 16),
            offset: new Vector2(-16, 0),
            pickColor: getPickColor(),
            animation: new SpriteAnimation("sexBimbo"),
            interactDistance: 50
        })
    }
    else
    {
        createActor("douche", "Ryder", "doucheDownStand", {
            position: new Vector2(100, -50),
            offset: new Vector2(-16, -3),
            pickColor: getPickColor(),
            animation: new SpriteAnimation("doucheDownStand"),
            interactDistance: 16
        })

        if (!bimboCum)
        {
            createActor("bimbo", "Brittany", "bimboDownStand", {
                position: new Vector2(50, -60),
                offset: new Vector2(-16, -3),
                pickColor: getPickColor(),
                interactDistance: 16,
                animation: new SpriteAnimation("bimboDownStand")
            })
        }
    }

    if (bimboCum)
    {
        createActor("bimbo", "Brittany", "bimboDownStandCum", {
            position: new Vector2(50, -60),
            offset: new Vector2(-16, -3),
            pickColor: getPickColor(),
            interactDistance: 16,
            animation: new SpriteAnimation("bimboDownStandCum")
        })
    }
}

function createCameraBounds(): void
{
    const left = -10 * 32
    const right = 10 * 32
    const bottom = -Infinity
    const top = 3 * 32

    const bottomLeft = new Vector2(left, bottom)
    const bottomRight = new Vector2(right, bottom)
    const topLeft = new Vector2(left, top)
    const topRight = new Vector2(right, top)

    const bounds = new Quad(bottomLeft, bottomRight, topLeft, topRight)
    setCameraBounds(bounds)
}

function createPathing(): void
{
    const left = -320
    const right = 320
    const boulderLeft = 96
    const boulderRight = 224

    const bottom = -128
    const top = 32
    const boulderBottom = 0

    const vertices = [
        new Vector2(left, bottom),
        new Vector2(boulderLeft, bottom),
        new Vector2(boulderRight, bottom),
        new Vector2(right, bottom),
        new Vector2(right, boulderBottom),
        new Vector2(right, top),
        new Vector2(boulderRight, top),
        new Vector2(boulderRight, boulderBottom),
        new Vector2(boulderLeft, boulderBottom),
        new Vector2(boulderLeft, top),
        new Vector2(left, top),
        new Vector2(left, boulderBottom)
    ]

    const pathing = new Pathing(vertices)

    for (let i = 0; i < vertices.length; i++)
    {
        const start = i
        const end = (i + 1) % vertices.length
        pathing.markOuterSegment(start, end)
    }

    pathing.markQuad(0, 1, 11, 8)
    pathing.markQuad(1, 2, 8, 7)
    pathing.markQuad(2, 3, 7, 4)
    pathing.markQuad(11, 8, 10, 9)
    pathing.markQuad(7, 4, 6, 5)

    setPathing(pathing)
}
