import { Actor } from "./actor"
import { updateCameraTransform } from "./camera"
import { hideTooltip, setTooltipPosition, setTooltipText, showTooltip } from "./dom"
import { getMouseCanvasPosition, getMouseWorldPosition, takeClick } from "./mouse"
import { getPickedColor } from "./renderer"
import { MoveScript } from "./scripts/move-script"
import { Script } from "./common"
import { InteractScript } from "./scripts/interact-script"
import { Pathing } from "./pathing"
import { getFoundTunaCount, state, TIME_OF_DAY } from "./state"
import { updateCamera} from "./camera"
import { updateMouse } from "./mouse"
import { shipwreck } from "./scenes/shipwreck"
import { westBeach } from "./scenes/west-beach"
import { intro } from "./scenes/intro"
import { cape } from "./scenes/cape"
import { rocks } from "./scenes/rocks"
import { jungle } from "./scenes/jungle"
import { shack } from "./scenes/shack"
import { outro } from "./scenes/outro"

export function updateScene(): void
{
    updateMouse()
    runScripts(globalScripts)

    if (state.playerControl)
    {
        const pickedActor = getPickedActor()
        setPlayerInteractTarget(pickedActor)
        movePlayer()
        updateTooltip(pickedActor)
    }
    else
    {
        clearHighlights()
        hideTooltip()
    }

    runActorScripts()
    updateActors()
    centerCameraOnPlayer()
    updateCamera()
}

const actors = new Set<Actor>()
const globalScripts = new Set<Script>()
let player: Actor | null = null
let pathing: Pathing | null = null

function movePlayer(): void
{
    if (!player || !pathing || !takeClick())
    {
        return
    }

    const clickPosition = getMouseWorldPosition()

    if (!clickPosition)
    {
        return
    }

    const path = pathing.getPath(player.position, clickPosition)

    if (path)
    {
        player.scripts.clear()
        const move = new MoveScript(player, path)
        player.scripts.add(move)
    }
}

export function setPlayerActor(player_: Actor): void
{
    player = player_
}

export function setPathing(pathing_: Pathing): void
{
    pathing = pathing_
}

export function createActor(...params: ConstructorParameters<typeof Actor>): Actor
{
    const actor = new Actor(...params)
    actors.add(actor)

    return actor
}

export function removeActor(actorId: string): void
{
    for (const actor of actors)
    {
        if (actor.id === actorId)
        {
            actors.delete(actor)
        }
    }
}

function runActorScripts(): void
{
    for (const actor of actors)
    {
        runScripts(actor.scripts)
    }
}

function runScripts(scripts: Set<Script>): boolean
{
    for (const script of scripts)
    {
        script.run()

        if (!script.done)
        {
            return false
        }

        scripts.delete(script)
    }

    return true
}

function updateActors(): void
{
    for (const actor of actors)
    {
        actor.updateAnimation()
        actor.updateTransform()
    }
}

function getPickedActor(): Actor | null
{
    const pickedColor = getPickedColor()

    if (!pickedColor)
    {
        return null
    }

    for (const actor of actors)
    {
        if (actor.pickColor === pickedColor)
        {
            return actor
        }
    }

    return null
}

function setPlayerInteractTarget(target: Actor | null): void
{
    if (!player || !target || !takeClick())
    {
        return
    }

    player.scripts.clear()
    const distance = player.position.distance(target.position)

    if (target.interactDistance < distance)
    {
        if (!pathing)
        {
            return
        }

        const end = (target.isTile && getMouseWorldPosition()) || target.position
        const path = pathing.getPath(player.position, end)

        if (!path)
        {
            return
        }

        player.interactTarget = target

        const move = new MoveScript(player, path, {
            useReference: true,
            maxDistance: target.interactDistance
        })
        player.scripts.add(move)
    }
    else
    {
        player.stopAnimation()
    }

    const interact = new InteractScript(target)
    player.scripts.add(interact)
}

function updateTooltip(pickedActor: Actor | null): void
{
    clearHighlights()

    if (pickedActor)
    {
        pickedActor.highlighted = true
        const mousePosition = getMouseCanvasPosition({ scaled: true })

        if (mousePosition)
        {
            setTooltipPosition(mousePosition)
        }

        setTooltipText(pickedActor.name)
        showTooltip()
    }
    else
    {
        hideTooltip()
    }
}

function centerCameraOnPlayer(): void
{
    if (player)
    {
        const playerSnappedPosition = player.position.clone().round()
        updateCameraTransform(playerSnappedPosition)
    }
}

function clearHighlights(): void
{
    for (const actor of actors)
    {
        actor.highlighted = false
    }
}

export function getActors(): Iterable<Actor>
{
    const sorted = Array.from(actors)
    sorted.sort((a, b) => b.getDrawPriority() - a.getDrawPriority())

    return sorted
}

export function addGlobalScript(script: Script): void
{
    globalScripts.add(script)
}

export function changeScene(key: Scene): void
{
    actors.clear()
    pathing = null
    player = null
    currentPickColor = 0

    if (state.timeOfDay === TIME_OF_DAY.DAY && getFoundTunaCount() === 2)
    {
        state.timeOfDay = TIME_OF_DAY.EVENING
    }
    else if (state.timeOfDay === TIME_OF_DAY.EVENING && state.searchForFlint)
    {
        state.timeOfDay = TIME_OF_DAY.NIGHT
    }

    previousScene = currentScene
    sceneCreation[key]()
    currentScene = key
}

const sceneCreation = {
    intro,
    shipwreck,
    jungle,
    shack,
    westBeach,
    cape,
    rocks,
    outro
}

export let previousScene: Scene | null = null

export let currentScene: Scene | null = null

export type Scene = keyof typeof sceneCreation

export function getPickColor(): number
{
    return ++currentPickColor
}

let currentPickColor = 0

export function getActor(actorId: string): Actor | null
{
    for (const actor of actors)
    {
        if (actor.id === actorId)
        {
            return actor
        }
    }

    return null
}
