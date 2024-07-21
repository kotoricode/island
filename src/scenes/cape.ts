import { setCameraBounds } from "../camera"
import { Pathing } from "../pathing"
import { Quad } from "../quad"
import { addGlobalScript, createActor, getPickColor, previousScene, setPathing, setPlayerActor } from "../scene"
import { DialogueScript } from "../scripts/dialogue-script"
import { FadeScript } from "../scripts/fade-script"
import { SetStateScript } from "../scripts/set-state-script"
import { WaitScript } from "../scripts/wait-script"
import { AnimationId, SpriteAnimation, SpriteId } from "../sprite"
import { state } from "../state"
import { Vector2 } from "../vector2"

export function cape(): void
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

    if (previousScene === "westBeach")
    {
        playerPosition = new Vector2(48, 32)
        playerSpriteId = "playerRightStand"
        playerAnimationId = "playerRightStand"
    }
    else
    {
        playerPosition = new Vector2(176, 32)
        playerSpriteId = "playerLeftStand"
        playerAnimationId = "playerLeftStand"
    }

    const player = createActor("player", "You", playerSpriteId, {
        position: playerPosition,
        offset: new Vector2(-16, -3),
        pickColor: getPickColor(),
        animation: new SpriteAnimation(playerAnimationId)
    })

    createActor("sand", "Sand", "sand", {
        uvRepeat: new Vector2(2, 2),
        scale: new Vector2(2, 2),
        drawPriority: 8000
    })
    createActor("sand", "Sand", "sand", {
        position: new Vector2(64, 0),
        uvRepeat: new Vector2(3, 2),
        scale: new Vector2(3, 2),
        drawPriority: 8000
    })
    createActor("sand", "Sand", "sand", {
        position: new Vector2(160, 0),
        uvRepeat: new Vector2(2, 2),
        scale: new Vector2(2, 2),
        drawPriority: 8000
    })
    createActor("sand", "Sand", "sand", {
        position: new Vector2(64, 64),
        uvRepeat: new Vector2(3, 6),
        scale: new Vector2(3, 6),
        drawPriority: 8000
    })

    createActor("water", "Water", "water1", {
        offset: new Vector2(-1600, -1600),
        uvRepeat: new Vector2(100, 100),
        scale: new Vector2(100, 100),
        drawPriority: 9000,
        animation: new SpriteAnimation("water")
    })
    createActor("toWestBeach", "To west beach", "exitDown", {
        position: new Vector2(0, 16),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })
    createActor("toRocks", "To rocks", "exitDown", {
        position: new Vector2(192, 16),
        drawPriority: 7000,
        pickColor: getPickColor(),
        isTile: true
    })

    createActor("bush", "Bush", "bush", { position: new Vector2(64 - 24, -10) })
    createActor("bush", "Bush", "bush", { position: new Vector2(64, -5) })
    createActor("bush", "Bush", "bush", { position: new Vector2(64 + 24, -10) })

    if (state.gatherAtCape)
    {
        const noControl = new SetStateScript("playerControl", false)
        const wait = new WaitScript(1)
        const fadeOut = new FadeScript(0.25)
        const dialogue1 = new DialogueScript([
            "After firing the flare gun, rescuers came to your location.",
            "Congratulations, you have escaped from the island."
        ], "narrator-text")
        const dialogue2 = new DialogueScript([
            "~ fin. ~"
        ], "narrator-text", { disableInteract: true })
        addGlobalScript(noControl)
        addGlobalScript(wait)
        addGlobalScript(fadeOut)
        addGlobalScript(dialogue1)
        addGlobalScript(dialogue2)

        createActor("douche", "Ryder", "doucheDownStand", {
            position: new Vector2(85, 60),
            offset: new Vector2(-16, -3),
            animation: new SpriteAnimation("doucheDownStand")
        })

        createActor("bimbo", "Brittany", "bimboLeftStand", {
            position: new Vector2(137, 117),
            offset: new Vector2(-16, -3),
            animation: new SpriteAnimation("bimboLeftStand")
        })
    }

    if (state.doucheIntro && !state.hasCapeTuna)
    {
        createActor("capeTuna", "Tuna", "tuna", {
            offset: new Vector2(-16, -16),
            position: new Vector2(112, 256),
            pickColor: getPickColor(),
            interactDistance: 16
        })
    }

    setPlayerActor(player)
}

function createCameraBounds(): void
{
    const left = -Infinity
    const right = Infinity
    const bottom = 0
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
    const left = 0
    const right = 224
    const bottom = 0
    const top = 256

    const ballTop = 64
    const leftBallRight = 64
    const rightBallLeft = 160

    const pathing = new Pathing([
        new Vector2(left, bottom),
        new Vector2(leftBallRight, bottom),
        new Vector2(rightBallLeft, bottom),
        new Vector2(right, bottom),
        new Vector2(right, ballTop),
        new Vector2(rightBallLeft, ballTop),
        new Vector2(rightBallLeft, top),
        new Vector2(leftBallRight, top),
        new Vector2(leftBallRight, ballTop),
        new Vector2(left, ballTop)
    ])

    pathing.markQuad(0, 1, 9, 8)
    pathing.markOuterSegment(0, 1)
    pathing.markOuterSegment(0, 9)
    pathing.markOuterSegment(9, 8)

    pathing.markQuad(1, 2, 8, 5)
    pathing.markOuterSegment(1, 2)

    pathing.markQuad(2, 3, 5, 4)
    pathing.markOuterSegment(2, 3)
    pathing.markOuterSegment(3, 4)
    pathing.markOuterSegment(4, 5)

    pathing.markQuad(8, 5, 7, 6)
    pathing.markOuterSegment(7, 8)
    pathing.markOuterSegment(6, 7)
    pathing.markOuterSegment(5, 6)

    setPathing(pathing)
}
