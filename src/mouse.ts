import { ndcToWorld } from "./camera"
import { DISPLAY_RESOLUTION, RESOLUTION_SCALE_FACTOR, getCanvas } from "./dom"
import { clamp } from "./common"
import { Vector2 } from "./vector2"

const canvasPosition = new Vector2()
const ndcPosition = new Vector2()
const worldPosition = new Vector2()

let moveEvent: MouseEvent | null = null
let clickEvent: MouseEvent | null = null
let onCanvas = false
let clicked = false

export function updateMouse(): void
{
    clicked = false

    if (!onCanvas)
    {
        return
    }

    if (clickEvent)
    {
        clicked = true
        clickEvent = null
    }

    if (moveEvent)
    {
        canvasPosition.x = clamp(moveEvent.pageX, 0, DISPLAY_RESOLUTION.x)
        canvasPosition.y = clamp(moveEvent.pageY, 0, DISPLAY_RESOLUTION.y)

        ndcPosition.x = (canvasPosition.x / DISPLAY_RESOLUTION.x) * 2 - 1
        ndcPosition.y = 1 - (canvasPosition.y / DISPLAY_RESOLUTION.y) * 2

        moveEvent = null
    }

    worldPosition.copy(ndcPosition)
    ndcToWorld(worldPosition)
}

export function attachMouseListeners(): void
{
    const canvas = getCanvas()

    canvas.addEventListener("mousemove", (event: MouseEvent) =>
    {
        moveEvent = event
        onCanvas = true
    })

    canvas.addEventListener("mouseleave", () =>
    {
        moveEvent = null
        clickEvent = null
        onCanvas = false
    })

    canvas.addEventListener("click", (event: MouseEvent) =>
    {
        clickEvent = event
        onCanvas = true
    })
}

export function getMouseWorldPosition(): Vector2 | null
{
    return onCanvas ? worldPosition.clone() : null
}

export function getMouseNdcPosition(): Vector2 | null
{
    return onCanvas ? ndcPosition.clone() : null
}

export function getMouseCanvasPosition(options?: { invertY?: boolean, scaled?: boolean }): Vector2 | null
{
    if (!onCanvas)
    {
        return null
    }

    const pos = canvasPosition.clone()

    if (options?.invertY)
    {
        pos.y = DISPLAY_RESOLUTION.y - pos.y
    }

    if (!options?.scaled)
    {
        pos.divideScalar(RESOLUTION_SCALE_FACTOR)
    }

    return pos
}

export function takeClick(): boolean
{
    const taken = clicked
    clicked = false

    return taken
}
