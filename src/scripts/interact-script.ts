import { Actor } from "../actor"
import { FadeScript } from "./fade-script"
import { DialogueScript } from "./dialogue-script"
import { SetStateScript } from "./set-state-script"
import { addGlobalScript, getActor, getPickColor, Scene } from "../scene"
import { getFoundTunaCount, state } from "../state"
import { ChangeSceneScript } from "./change-scene-script"
import { WaitScript } from "./wait-script"
import { CreateActorScript } from "./create-actor-script"
import { SetAnimationScript } from "./set-animation-script"
import { Vector2 } from "../vector2"
import { AnimationId, SpriteAnimation } from "../sprite"
import { PlayMusicScript } from "./play-music-script"
import { MoveScript } from "./move-script"
import { RemoveActorScript } from "./remove-actor-script"
import { SerialScript } from "./serial-scripts"

export class InteractScript
{
    done = false

    constructor(private target: Actor)
    {
    }

    run(): void
    {
        if (this.target.id === "player")
        {
            disablePlayerControl()
            showPlayerStatus()
            enablePlayerControl()
        }
        else if (this.target.id === "douche")
        {
            disablePlayerControl()
            showDoucheDialogue()
            enablePlayerControl()
        }
        else if (this.target.id === "toWestBeach")
        {
            changeScene("westBeach", true)
        }
        else if (this.target.id === "toShipwreck")
        {
            changeScene("shipwreck", true)
        }
        else if (this.target.id === "toCape")
        {
            const control = !state.gatherAtCape
            changeScene("cape", control)
        }
        else if (this.target.id === "toRocks")
        {
            changeScene("rocks", true)
        }
        else if (this.target.id === "toJungle")
        {
            const playerControl = !state.doucheFoundAllTuna || state.gatherAtJungle
            changeScene("jungle", playerControl)
        }
        else if (this.target.id === "toShack")
        {
            if (state.hasKey)
            {
                changeScene("shack", true)
                setState("enteredShack", true)
            }
            else
            {
                showDialogue([
                    "The door's locked.",
                    "I need to find the key to open it."
                ], "narrator-text")
            }
        }
        else if (this.target.id === "bimbo")
        {
            showBimboDialogue()
        }
        else if (this.target.id === "sexBimbo")
        {
            sexBimbo1(this.target)
        }
        else if (this.target.id === "torch")
        {
            removeActor("torch")
            state.hasTorch = true
        }
        else if (this.target.id === "flint")
        {
            removeActor("flint")
            state.hasFlint = true
        }
        else if (this.target.id === "flareGun")
        {
            removeActor("flareGun")
            state.hasFlareGun = true

            if (state.gatherAtShack)
            {
                showDialogue([
                    "You found a flare gun!?",
                    "We can use that to alert rescuers!",
                    "Quick, let's go to the cape and fire it while it's still dark out!"
                ], "douche-text")
                disablePlayerControl()

                const bimbo = getActor("bimbo")
                const douche = getActor("douche")

                if (bimbo)
                {
                    const scripts = [
                        new MoveScript(bimbo, [
                            new Vector2(16, -16)
                        ]),
                        new WaitScript(0.2),
                        new RemoveActorScript("bimbo")
                    ]

                    const serial = new SerialScript(scripts)
                    addGlobalScript(serial)
                }

                if (douche && state.affection < 3)
                {
                    const scripts = [
                        new WaitScript(1.5),
                        new MoveScript(douche, [
                            new Vector2(16, -16)
                        ]),
                        new WaitScript(0.2),
                        new RemoveActorScript("douche")
                    ]

                    const serial = new SerialScript(scripts)
                    addGlobalScript(serial)
                    enablePlayerControl()
                }
                else if (state.affection === 3)
                {
                    showDialogue([
                        "Before we go..."
                    ], "douche-text")
                    fadeOut()
                    removeActor("douche")
                    removeActor("player")
                    createActor("sexPlayer", "Sex Player", "sexPlayer1", {
                        position: new Vector2(-64, 0),
                        animation: new SpriteAnimation("sexPlayer")
                    })
                    playMusic("002.ogg")
                    fadeIn()
                    wait(3)
                    setAnimation("sexPlayer", "sexPlayerFinish")
                    wait(3)
                    fadeOut()
                    wait(2)
                    playMusic("001.ogg")
                    changeScene("jungle", true)
                }

                setState("gatherAtCape", true)
            }
        }
        else if (this.target.id === "key")
        {
            removeActor("key")
            showDialogue([
                "You found a key hidden in the grass.",
                "Maybe it is for the shack?"
            ], "narrator-text")
            state.hasKey = true
        }
        else if (this.target.id === "westBeachTuna")
        {
            removeActor("westBeachTuna")
            state.hasWestBeachTuna = true
        }
        else if (this.target.id === "capeTuna")
        {
            removeActor("capeTuna")
            state.hasCapeTuna = true
        }
        else if (this.target.id === "rocksTuna")
        {
            removeActor("rocksTuna")
            state.hasRocksTuna = true
        }
        else
        {
            console.warn("Not implemented", this.target.id)
        }

        this.done = true
    }
}

function showDialogue(texts: string[], style: "narrator-text" | "douche-text" | "bimbo-text"): void
{
    const dialogue = new DialogueScript(texts, style)
    addGlobalScript(dialogue)
}

function enablePlayerControl(): void
{
    setState("playerControl", true)
}

function disablePlayerControl(): void
{
    setState("playerControl", false)
}

function fadeOut(): void
{
    const fadeOut = new FadeScript(2)
    addGlobalScript(fadeOut)
}

function removeActor(actorId: string): void
{
    const script = new RemoveActorScript(actorId)
    addGlobalScript(script)
}

function fadeIn(): void
{
    const fadeIn = new FadeScript(-2)
    addGlobalScript(fadeIn)
}

function showPlayerStatus(): void
{
    const items: string[] = []

    if (state.hasFlint)
    {
        items.push("Flint")
    }

    if (state.hasTorch)
    {
        items.push("Torch")
    }

    if (state.hasKey)
    {
        items.push("Key")
    }

    if (state.hasFlareGun)
    {
        items.push("Flare gun")
    }

    const tuna = getFoundTunaCount()

    if (tuna)
    {
        items.push(`Tuna x${tuna}`)
    }

    const itemsText = items.length ? items.join(", ") : "None"

    showDialogue([
        `Ryder affection: ${state.affection}/3`,
        `Items: ${itemsText}`
    ], "narrator-text")
}

function playMusic(filename: string): void
{
    const script = new PlayMusicScript(filename)
    addGlobalScript(script)
}

function showDoucheDialogue(): void
{
    if (state.hasKey && !state.hasFlareGun)
    {
        if (state.enteredShack)
        {
            showDialogue([
                "Damn it's dark in here."
            ], "douche-text")
        }
        else
        {
            showDialogue([
                "A key?",
                "Try it on the shack door."
            ], "douche-text")
        }

        if (!state.gatherAtShack)
        {
            setState("gatherAtShack", true)
            incrementAffection()
        }

        return
    }

    if (!state.gatherAtShack && state.hasFlareGun)
    {
        showDialogue([
            "You found a flare gun!?",
            "We can use that to alert rescuers!",
            "Quick, let's go to the cape and fire it while it's still dark out!"
        ], "douche-text")

        setState("gatherAtCape", true)

        return
    }

    if (!state.doucheIntro)
    {
        showDialogue([
            "Holy smokes, that ship sank real fast.",
            "Looks like we're the only ones to wash ashore on this island.",
            "Haven't seen anyone else around, and the island seems uninhabited.",
            "We'll have to figure out a way to make it outta here.",
            "Before that though, we should secure us some food and shelter.",
            "See if you can find some lying around.",
            "You should be able to find some by the shore."
        ], "douche-text")

        setState("doucheIntro", true)

        if (!state.bimboIntro)
        {
            incrementAffection()
        }

        return
    }

    if (!state.doucheFoundAllTuna && !state.gatherAtJungle)
    {
        const tuna = getFoundTunaCount()

        if (tuna === 2 && !state.witnessSexBimbo)
        {
            showDialogue([
                "Oh, you're back already?",
                "Just gimme a second..."
            ], "douche-text")

            return
        }

        if (!tuna)
        {
            showDialogue([
                "Find anything yet?",
                "There should be a bunch of stuff washed up ashore."
            ], "douche-text")
        }
        else if (tuna < 3)
        {
            showDialogue([
                "Oh sweet, you've got us some food.",
                "We're gonna need more than this though. Keep on lookin'."
            ], "douche-text")
        }
        else
        {
            showDialogue([
                "That should be enough for now.",
                "Now let's look for shelter."
            ], "douche-text")

            setState("doucheFoundAllTuna", true)
        }

        return
    }

    if (state.gatherAtJungle)
    {
        if (state.hasTorch)
        {
            if (state.hasFlint)
            {
                if (state.firePlaced)
                {
                    showDialogue([
                        "That should keep us warm for the night."
                    ], "douche-text")
                }
                else
                {
                    showDialogue([
                        "Great. Now we can light the torch and use it to start a fire.",
                        "Hold on a sec..."
                    ], "douche-text")

                    setState("firePlaced", true)
                    createActor("fire", "Fire", "fire1", {
                        position: new Vector2(18, 113),
                        offset: new Vector2(-16, -16),
                        animation: new SpriteAnimation("fire")
                    })
                    createActor("key", "Glimmer", "glimmer1", {
                        position: new Vector2(73, 150),
                        offset: new Vector2(-16, -16),
                        animation: new SpriteAnimation("glimmer"),
                        pickColor: getPickColor()
                    })
                }
            }
            else
            {
                showDialogue([
                    "What's that? A torch?",
                    "An unlit torch won't be of much use.",
                    "You'll have to find a way to light it up."
                ], "douche-text")

                setState("searchForFlint", true)
            }
        }
        else
        {
            showDialogue([
                "The night's gonna be real chilly out here.",
                "We need to figure something out."
            ], "douche-text")
        }
    }
}

function showBimboDialogue(): void
{
    const tuna = getFoundTunaCount()
    const sexBimbo = tuna === 2 && !state.witnessSexBimbo
    const cumBimbo = (tuna === 3 || (tuna === 2 && state.witnessSexBimbo)) && !state.gatherAtJungle

    if (sexBimbo)
    {
        showDialogue([
            "!?"
        ], "bimbo-text")

        return
    }

    if (cumBimbo)
    {
        showDialogue([
            "ughhh my makeups all ruined and stuff",
            "this is like, literally the worst"
        ], "bimbo-text")

        return
    }

    if (!state.bimboIntro)
    {
        showDialogue([
            "anywho, nice to meet ya"
        ], "bimbo-text")
        setState("bimboIntro", true)

        return
    }

    if (state.doucheIntro && !state.gatherAtJungle)
    {
        showDialogue([
            "scavenging for food, what is this, the middle ages???",
            "thats like literally manual labor, so i aint doing it"
        ], "bimbo-text")

        return
    }

    if (state.gatherAtJungle)
    {
        showDialogue([
            "whats up with all these mosquitoes!?"
        ], "bimbo-text")

        return
    }

    if (state.gatherAtShack)
    {
        showDialogue([
            "this place could use some decoration!!!"
        ], "bimbo-text")

        return
    }

    showDialogue([
        "oh my gawd, my phone cant get any signal???"
    ], "bimbo-text")

}

function wait(duration: number): void
{
    const script = new WaitScript(duration)
    addGlobalScript(script)
}

function setAnimation(actorId: string, animationId: AnimationId | null): void
{
    const script = new SetAnimationScript(actorId, animationId)
    addGlobalScript(script)
}

function setState<StateKey extends keyof typeof state>(key: StateKey, value: typeof state[StateKey]): void
{
    const script = new SetStateScript(key, value)
    addGlobalScript(script)
}

function createActor(...params: ConstructorParameters<typeof Actor>): void
{
    const script = new CreateActorScript(params)
    addGlobalScript(script)
}

function incrementAffection(): void
{
    const script = new SetStateScript("affection", state.affection + 1)
    addGlobalScript(script)
}

function changeScene(key: Scene, enablePlayerControl_: boolean): void
{
    const script = new ChangeSceneScript(key)

    disablePlayerControl()
    fadeOut()
    addGlobalScript(script)

    if (enablePlayerControl_)
    {
        enablePlayerControl()
    }

    fadeIn()
}

function sexBimbo1(actor: Actor): void
{
    disablePlayerControl()
    playMusic("002.ogg")
    incrementAffection()
    showDoucheDialogue()
    showBimboDialogue()
    setState("witnessSexBimbo", true)
    setAnimation(actor.id, "sexBimboFinish")
    wait(3)
    setAnimation(actor.id, null)
    wait(0.7)
    createActor("cumPool1", "Cum pool 1", "cumPool", {
        position: new Vector2(114, 14),
        drawPriority: 1000
    })
    wait(1)
    createActor("cumPool2", "Cum pool 2", "cumPool", {
        position: new Vector2(114, 16),
        drawPriority: 1000
    })
    wait(1.5)
    fadeOut()
    changeScene("shipwreck", true)
    playMusic("001.ogg")
    fadeIn()
}
