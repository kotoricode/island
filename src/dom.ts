import { Vector2 } from "./vector2"

const canvas = getElement<HTMLCanvasElement>("canvas")
let context: WebGL2RenderingContextStrict | null = null
const tooltip = getElement<HTMLSpanElement>("#tooltip")
const dialogueBox = getElement<HTMLDivElement>("#dialogue-box")
const dialogueTextShown = getElement<HTMLSpanElement>("#dialogue-text-shown")
const dialogueTextHidden = getElement<HTMLSpanElement>("#dialogue-text-hidden")

hideDialogueBox()
hideTooltip()

export const DISPLAY_RESOLUTION = new Vector2(1280, 720)

export const RESOLUTION_SCALE_FACTOR = 4

export const RESOLUTION = DISPLAY_RESOLUTION.clone().divideScalar(RESOLUTION_SCALE_FACTOR)

export function getCanvas(): HTMLCanvasElement
{
    return canvas
}

export function getRenderingContext(): WebGL2RenderingContextStrict
{
    if (!context)
    {
        const canvas = getCanvas()
        const context_ = canvas.getContext("webgl2")

        if (!context_)
        {
            throw Error("Missing rendering context")
        }

        context = <WebGL2RenderingContextStrict><unknown>context_
    }

    return context
}

export function setTooltipText(text: string): void
{
    tooltip.textContent = text
}

export function showTooltip(): void
{
    tooltip.classList.remove("hide")
}

export function hideTooltip(): void
{
    tooltip.classList.add("hide")
}

export function setTooltipPosition(position: Vector2): void
{
    const threshold = 100
    const offset = 30
    const aspectRatio = DISPLAY_RESOLUTION.x / DISPLAY_RESOLUTION.y

    if (position.x > DISPLAY_RESOLUTION.x - threshold * aspectRatio)
    {
        tooltip.style.left = "unset"
        tooltip.style.right = `${DISPLAY_RESOLUTION.x - position.x + offset}px`
    }
    else
    {
        tooltip.style.left = `${position.x + offset}px`
        tooltip.style.right = "unset"
    }

    if (position.y > DISPLAY_RESOLUTION.y - threshold)
    {
        tooltip.style.bottom = `${DISPLAY_RESOLUTION.y - position.y + offset}px`
        tooltip.style.top = "unset"
    }
    else
    {
        tooltip.style.bottom = "unset"
        tooltip.style.top = `${position.y + offset}px`
    }
}

export function showDialogueBox(): void
{
    dialogueBox.classList.remove("hide")
}

export function hideDialogueBox(): void
{
    dialogueBox.classList.add("hide")
}

export function setDialogueTextStyle(value: "narrator-text" | "douche-text" |"bimbo-text"): void
{
    if (value === "douche-text")
    {
        dialogueBox.classList.add("douche-text")
        dialogueBox.classList.remove("bimbo-text")
        dialogueBox.classList.remove("narrator-text")
    }
    else if (value === "bimbo-text")
    {
        dialogueBox.classList.add("bimbo-text")
        dialogueBox.classList.remove("douche-text")
        dialogueBox.classList.remove("narrator-text")
    }
    else
    {
        dialogueBox.classList.remove("douche-text")
        dialogueBox.classList.remove("bimbo-text")
        dialogueBox.classList.add("narrator-text")
    }
}

export function setDialogueText(value: string, shownLength: number): void
{
    dialogueTextShown.textContent = value.substring(0, shownLength)
    dialogueTextHidden.textContent = value.substring(shownLength)
}

function getElement<T extends HTMLElement>(query: string): T
{
    const element = document.querySelector<T>(query)

    if (!element)
    {
        throw Error(`Missing element: ${query}`)
    }

    return element
}
