import { getDeltaTime } from "./time"
import { Vector2 } from "./vector2"

export type AtlasData = {
    size: Vector2
}

export type AtlasId = keyof typeof atlases

export type SpriteData = {
    atlasId: AtlasId
    offset: Vector2
    size: Vector2
}

export type SpriteId = keyof typeof sprites

export type AnimationFrame = {
    spriteId: SpriteId
    duration: number
}

export type AnimationId = keyof typeof animations

export class SpriteAnimation
{
    private frames: AnimationFrame[]
    private frameIndex = 0
    private frameElapsed = 0

    constructor(animationId: AnimationId)
    {
        this.frames = getAnimation(animationId)
    }

    setAnimation(animationId: AnimationId): void
    {
        this.frames = getAnimation(animationId)
        this.frameIndex %= this.frames.length
    }

    updateAnimation(): void
    {
        if (this.frames.length === 1)
        {
            return
        }

        this.frameElapsed += getDeltaTime()
        let currentFrame = this.frames[this.frameIndex]

        while (currentFrame.duration <= this.frameElapsed)
        {
            this.frameElapsed -= currentFrame.duration
            this.frameIndex = (this.frameIndex + 1) % this.frames.length
            currentFrame = this.frames[this.frameIndex]
        }
    }

    getCurrentFrame(): AnimationFrame
    {
        return this.frames[this.frameIndex]
    }
}

export function getSprite(spriteId: SpriteId): SpriteData
{
    return sprites[spriteId]
}

export function getAtlas(atlasId: AtlasId): AtlasData
{
    return atlases[atlasId]
}

export function getAnimation(animationId: AnimationId): AnimationFrame[]
{
    return animations[animationId]
}

const atlases = <const>{
    "tiles.png":  { size: new Vector2(128, 128) },
    "player.png": { size: new Vector2(256, 256) },
    "douche.png": { size: new Vector2(256, 256) },
    "bimbo.png":  { size: new Vector2(256, 256) },
    "items.png":  { size: new Vector2(256, 32) },
    "nature.png": { size: new Vector2(256, 256) },
    "sex.png":    { size: new Vector2(256, 256) }
} satisfies Record<string, AtlasData>

const sprites = {
    playerDownStand:       { atlasId: "player.png", offset: new Vector2(0, 0),    size: new Vector2(32, 64) },
    playerDownWalk1:       { atlasId: "player.png", offset: new Vector2(32, 0),   size: new Vector2(32, 64) },
    playerDownWalk2:       { atlasId: "player.png", offset: new Vector2(64, 0),   size: new Vector2(32, 64) },
    playerUpStand:         { atlasId: "player.png", offset: new Vector2(96, 0),   size: new Vector2(32, 64) },
    playerUpWalk1:         { atlasId: "player.png", offset: new Vector2(128, 0),  size: new Vector2(32, 64) },
    playerUpWalk2:         { atlasId: "player.png", offset: new Vector2(160, 0),  size: new Vector2(32, 64) },
    playerLeftStand:       { atlasId: "player.png", offset: new Vector2(0, 64),   size: new Vector2(32, 64) },
    playerLeftWalk1:       { atlasId: "player.png", offset: new Vector2(32, 64),  size: new Vector2(32, 64) },
    playerLeftWalk2:       { atlasId: "player.png", offset: new Vector2(64, 64),  size: new Vector2(32, 64) },
    playerRightStand:      { atlasId: "player.png", offset: new Vector2(96, 64),  size: new Vector2(32, 64) },
    playerRightWalk1:      { atlasId: "player.png", offset: new Vector2(128, 64), size: new Vector2(32, 64) },
    playerRightWalk2:      { atlasId: "player.png", offset: new Vector2(160, 64), size: new Vector2(32, 64) },
    playerDownStandBlink:  { atlasId: "player.png", offset: new Vector2(0, 128),  size: new Vector2(32, 64) },
    playerLeftStandBlink:  { atlasId: "player.png", offset: new Vector2(32, 128), size: new Vector2(32, 64) },
    playerRightStandBlink: { atlasId: "player.png", offset: new Vector2(64, 128), size: new Vector2(32, 64) },

    doucheDownStand:       { atlasId: "douche.png", offset: new Vector2(0, 0),    size: new Vector2(32, 64) },
    doucheDownWalk1:       { atlasId: "douche.png", offset: new Vector2(32, 0),   size: new Vector2(32, 64) },
    doucheDownWalk2:       { atlasId: "douche.png", offset: new Vector2(64, 0),   size: new Vector2(32, 64) },
    doucheUpStand:         { atlasId: "douche.png", offset: new Vector2(96, 0),   size: new Vector2(32, 64) },
    doucheUpWalk1:         { atlasId: "douche.png", offset: new Vector2(128, 0),  size: new Vector2(32, 64) },
    doucheUpWalk2:         { atlasId: "douche.png", offset: new Vector2(160, 0),  size: new Vector2(32, 64) },
    doucheLeftStand:       { atlasId: "douche.png", offset: new Vector2(0, 64),   size: new Vector2(32, 64) },
    doucheLeftWalk1:       { atlasId: "douche.png", offset: new Vector2(32, 64),  size: new Vector2(32, 64) },
    doucheLeftWalk2:       { atlasId: "douche.png", offset: new Vector2(64, 64),  size: new Vector2(32, 64) },
    doucheRightStand:      { atlasId: "douche.png", offset: new Vector2(96, 64),  size: new Vector2(32, 64) },
    doucheRightWalk1:      { atlasId: "douche.png", offset: new Vector2(128, 64), size: new Vector2(32, 64) },
    doucheRightWalk2:      { atlasId: "douche.png", offset: new Vector2(160, 64), size: new Vector2(32, 64) },
    doucheDownStandBlink:  { atlasId: "douche.png", offset: new Vector2(0, 128),  size: new Vector2(32, 64) },
    doucheLeftStandBlink:  { atlasId: "douche.png", offset: new Vector2(32, 128), size: new Vector2(32, 64) },
    doucheRightStandBlink: { atlasId: "douche.png", offset: new Vector2(64, 128), size: new Vector2(32, 64) },

    bimboDownStand:         { atlasId: "bimbo.png", offset: new Vector2(0, 0),    size: new Vector2(32, 64) },
    bimboDownWalk1:         { atlasId: "bimbo.png", offset: new Vector2(32, 0),   size: new Vector2(32, 64) },
    bimboDownWalk2:         { atlasId: "bimbo.png", offset: new Vector2(64, 0),   size: new Vector2(32, 64) },
    bimboUpStand:           { atlasId: "bimbo.png", offset: new Vector2(96, 0),   size: new Vector2(32, 64) },
    bimboUpWalk1:           { atlasId: "bimbo.png", offset: new Vector2(128, 0),  size: new Vector2(32, 64) },
    bimboUpWalk2:           { atlasId: "bimbo.png", offset: new Vector2(160, 0),  size: new Vector2(32, 64) },
    bimboLeftStand:         { atlasId: "bimbo.png", offset: new Vector2(0, 64),   size: new Vector2(32, 64) },
    bimboLeftWalk1:         { atlasId: "bimbo.png", offset: new Vector2(32, 64),  size: new Vector2(32, 64) },
    bimboLeftWalk2:         { atlasId: "bimbo.png", offset: new Vector2(64, 64),  size: new Vector2(32, 64) },
    bimboRightStand:        { atlasId: "bimbo.png", offset: new Vector2(96, 64),  size: new Vector2(32, 64) },
    bimboRightWalk1:        { atlasId: "bimbo.png", offset: new Vector2(128, 64), size: new Vector2(32, 64) },
    bimboRightWalk2:        { atlasId: "bimbo.png", offset: new Vector2(160, 64), size: new Vector2(32, 64) },
    bimboDownStandBlink:    { atlasId: "bimbo.png", offset: new Vector2(0, 128),  size: new Vector2(32, 64) },
    bimboLeftStandBlink:    { atlasId: "bimbo.png", offset: new Vector2(32, 128), size: new Vector2(32, 64) },
    bimboRightStandBlink:   { atlasId: "bimbo.png", offset: new Vector2(64, 128), size: new Vector2(32, 64) },
    bimboDownStandCum:      { atlasId: "bimbo.png", offset: new Vector2(0, 196),  size: new Vector2(32, 64) },
    bimboDownStandBlinkCum: { atlasId: "bimbo.png", offset: new Vector2(32, 196), size: new Vector2(32, 64) },

    torch:    { atlasId: "items.png", offset: new Vector2(0, 0),   size: new Vector2(32, 32) },
    flint:    { atlasId: "items.png", offset: new Vector2(32, 0),  size: new Vector2(32, 32) },
    flareGun: { atlasId: "items.png", offset: new Vector2(64, 0),  size: new Vector2(32, 32) },
    note:     { atlasId: "items.png", offset: new Vector2(96, 0),  size: new Vector2(32, 32) },
    tuna:     { atlasId: "items.png", offset: new Vector2(128, 0), size: new Vector2(32, 32) },
    key:      { atlasId: "items.png", offset: new Vector2(160, 0), size: new Vector2(32, 32) },

    sand:      { atlasId: "tiles.png", offset: new Vector2(0, 0),   size: new Vector2(32, 32) },
    grass:     { atlasId: "tiles.png", offset: new Vector2(32, 0),  size: new Vector2(32, 32) },
    water1:    { atlasId: "tiles.png", offset: new Vector2(64, 0),  size: new Vector2(32, 32) },
    water2:    { atlasId: "tiles.png", offset: new Vector2(96, 0),  size: new Vector2(32, 32) },
    plants:    { atlasId: "tiles.png", offset: new Vector2(0, 32),  size: new Vector2(32, 32) },
    floor:     { atlasId: "tiles.png", offset: new Vector2(32, 32), size: new Vector2(32, 32) },
    fire1:     { atlasId: "tiles.png", offset: new Vector2(64, 32), size: new Vector2(32, 32) },
    fire2:     { atlasId: "tiles.png", offset: new Vector2(96, 32), size: new Vector2(32, 32) },
    exitLeft:  { atlasId: "tiles.png", offset: new Vector2(0, 64),  size: new Vector2(32, 32) },
    exitRight: { atlasId: "tiles.png", offset: new Vector2(32, 64), size: new Vector2(32, 32) },
    exitUp:    { atlasId: "tiles.png", offset: new Vector2(64, 64), size: new Vector2(32, 32) },
    exitDown:  { atlasId: "tiles.png", offset: new Vector2(96, 64), size: new Vector2(32, 32) },
    glimmer1:  { atlasId: "tiles.png", offset: new Vector2(0, 96),  size: new Vector2(32, 32) },
    glimmer2:  { atlasId: "tiles.png", offset: new Vector2(32, 96), size: new Vector2(32, 32) },

    tree:    { atlasId: "nature.png", offset: new Vector2(0, 0),   size: new Vector2(64, 160)  },
    boulder: { atlasId: "nature.png", offset: new Vector2(64, 0),  size: new Vector2(96, 96)   },
    bush:    { atlasId: "nature.png", offset: new Vector2(160, 0), size: new Vector2(96, 64)   },
    shack:   { atlasId: "nature.png", offset: new Vector2(64, 96), size: new Vector2(192, 160) },

    sexBimbo1:  { atlasId: "sex.png", offset: new Vector2(0, 0),   size: new Vector2(64, 64) },
    sexBimbo2:  { atlasId: "sex.png", offset: new Vector2(64, 0),  size: new Vector2(64, 64) },
    sexBimbo3:  { atlasId: "sex.png", offset: new Vector2(128, 0), size: new Vector2(64, 64) },
    sexBimbo4:  { atlasId: "sex.png", offset: new Vector2(192, 0), size: new Vector2(64, 64) },
    sexPlayer1: { atlasId: "sex.png", offset: new Vector2(0, 64), size: new Vector2(64, 64) },
    sexPlayer2: { atlasId: "sex.png", offset: new Vector2(64, 64), size: new Vector2(64, 64) },
    cumPool:    { atlasId: "sex.png", offset: new Vector2(0, 224), size: new Vector2(11, 6)  }
} satisfies Record<string, SpriteData>

const animations = <const>{
    playerLeftStand: [
        { spriteId: "playerLeftStand", duration: 4.0 },
        { spriteId: "playerLeftStandBlink", duration: 0.1 },
        { spriteId: "playerLeftStand", duration: 5.5 },
        { spriteId: "playerLeftStandBlink", duration: 0.1 },
        { spriteId: "playerLeftStand", duration: 0.1 },
        { spriteId: "playerLeftStandBlink", duration: 0.1 }
    ],
    playerRightStand: [
        { spriteId: "playerRightStand", duration: 4.0 },
        { spriteId: "playerRightStandBlink", duration: 0.1 },
        { spriteId: "playerRightStand", duration: 5.5 },
        { spriteId: "playerRightStandBlink", duration: 0.1 },
        { spriteId: "playerRightStand", duration: 0.1 },
        { spriteId: "playerRightStandBlink", duration: 0.1 }
    ],
    playerUpStand: [
        { spriteId: "playerUpStand", duration: 0.1 }
    ],
    playerDownStand: [
        { spriteId: "playerDownStand", duration: 4.0 },
        { spriteId: "playerDownStandBlink", duration: 0.1 },
        { spriteId: "playerDownStand", duration: 5.5 },
        { spriteId: "playerDownStandBlink", duration: 0.1 },
        { spriteId: "playerDownStand", duration: 0.1 },
        { spriteId: "playerDownStandBlink", duration: 0.1 }
    ],
    playerLeftMove: [
        { spriteId: "playerLeftWalk1", duration: 0.14 },
        { spriteId: "playerLeftStand", duration: 0.14 },
        { spriteId: "playerLeftWalk2", duration: 0.14 },
        { spriteId: "playerLeftStand", duration: 0.14 }
    ],
    playerRightMove: [
        { spriteId: "playerRightWalk1", duration: 0.14 },
        { spriteId: "playerRightStand", duration: 0.14 },
        { spriteId: "playerRightWalk2", duration: 0.14 },
        { spriteId: "playerRightStand", duration: 0.14 }
    ],
    playerUpMove: [
        { spriteId: "playerUpWalk1", duration: 0.14 },
        { spriteId: "playerUpStand", duration: 0.14 },
        { spriteId: "playerUpWalk2", duration: 0.14 },
        { spriteId: "playerUpStand", duration: 0.14 }
    ],
    playerDownMove: [
        { spriteId: "playerDownWalk1", duration: 0.14 },
        { spriteId: "playerDownStand", duration: 0.14 },
        { spriteId: "playerDownWalk2", duration: 0.14 },
        { spriteId: "playerDownStand", duration: 0.14 }
    ],

    doucheLeftStand: [
        { spriteId: "doucheLeftStand", duration: 4.0 },
        { spriteId: "doucheLeftStandBlink", duration: 0.1 },
        { spriteId: "doucheLeftStand", duration: 5.5 },
        { spriteId: "doucheLeftStandBlink", duration: 0.1 },
        { spriteId: "doucheLeftStand", duration: 0.1 },
        { spriteId: "doucheLeftStandBlink", duration: 0.1 }
    ],
    doucheRightStand: [
        { spriteId: "doucheRightStand", duration: 4.65 },
        { spriteId: "doucheRightStandBlink", duration: 0.15 }
    ],
    doucheUpStand: [
        { spriteId: "doucheUpStand", duration: 0.1 }
    ],
    doucheDownStand: [
        { spriteId: "doucheDownStand", duration: 4.65 },
        { spriteId: "doucheDownStandBlink", duration: 0.15 }
    ],
    doucheLeftMove: [
        { spriteId: "doucheLeftWalk1", duration: 0.14 },
        { spriteId: "doucheLeftStand", duration: 0.14 },
        { spriteId: "doucheLeftWalk2", duration: 0.14 },
        { spriteId: "doucheLeftStand", duration: 0.14 }
    ],
    doucheRightMove: [
        { spriteId: "doucheRightWalk1", duration: 0.14 },
        { spriteId: "doucheRightStand", duration: 0.14 },
        { spriteId: "doucheRightWalk2", duration: 0.14 },
        { spriteId: "doucheRightStand", duration: 0.14 }
    ],
    doucheUpMove: [
        { spriteId: "doucheUpWalk1", duration: 0.14 },
        { spriteId: "doucheUpStand", duration: 0.14 },
        { spriteId: "doucheUpWalk2", duration: 0.14 },
        { spriteId: "doucheUpStand", duration: 0.14 }
    ],
    doucheDownMove: [
        { spriteId: "doucheDownWalk1", duration: 0.14 },
        { spriteId: "doucheDownStand", duration: 0.14 },
        { spriteId: "doucheDownWalk2", duration: 0.14 },
        { spriteId: "doucheDownStand", duration: 0.14 }
    ],

    bimboLeftStand: [
        { spriteId: "bimboLeftStand", duration: 4.0 },
        { spriteId: "bimboLeftStandBlink", duration: 0.1 },
        { spriteId: "bimboLeftStand", duration: 5.5 },
        { spriteId: "bimboLeftStandBlink", duration: 0.1 },
        { spriteId: "bimboLeftStand", duration: 0.1 },
        { spriteId: "bimboLeftStandBlink", duration: 0.1 }
    ],
    bimboRightStand: [
        { spriteId: "bimboRightStand", duration: 4.0 },
        { spriteId: "bimboRightStandBlink", duration: 0.1 },
        { spriteId: "bimboRightStand", duration: 5.5 },
        { spriteId: "bimboRightStandBlink", duration: 0.1 },
        { spriteId: "bimboRightStand", duration: 0.1 },
        { spriteId: "bimboRightStandBlink", duration: 0.1 }
    ],
    bimboUpStand: [
        { spriteId: "bimboUpStand", duration: 0.1 }
    ],
    bimboDownStand: [
        { spriteId: "bimboDownStand", duration: 3 },
        { spriteId: "bimboDownStandBlink", duration: 0.17 }
    ],
    bimboLeftMove: [
        { spriteId: "bimboLeftWalk1", duration: 0.14 },
        { spriteId: "bimboLeftStand", duration: 0.14 },
        { spriteId: "bimboLeftWalk2", duration: 0.14 },
        { spriteId: "bimboLeftStand", duration: 0.14 }
    ],
    bimboRightMove: [
        { spriteId: "bimboRightWalk1", duration: 0.14 },
        { spriteId: "bimboRightStand", duration: 0.14 },
        { spriteId: "bimboRightWalk2", duration: 0.14 },
        { spriteId: "bimboRightStand", duration: 0.14 }
    ],
    bimboUpMove: [
        { spriteId: "bimboUpWalk1", duration: 0.14 },
        { spriteId: "bimboUpStand", duration: 0.14 },
        { spriteId: "bimboUpWalk2", duration: 0.14 },
        { spriteId: "bimboUpStand", duration: 0.14 }
    ],
    bimboDownMove: [
        { spriteId: "bimboDownWalk1", duration: 0.14 },
        { spriteId: "bimboDownStand", duration: 0.14 },
        { spriteId: "bimboDownWalk2", duration: 0.14 },
        { spriteId: "bimboDownStand", duration: 0.14 }
    ],
    bimboDownStandCum: [
        { spriteId: "bimboDownStandCum", duration: 3 },
        { spriteId: "bimboDownStandBlinkCum", duration: 0.17 }
    ],

    sexBimbo: [
        { spriteId: "sexBimbo1", duration: 0.3 },
        { spriteId: "sexBimbo2", duration: 0.3 }
    ],
    sexBimboFinish: [
        { spriteId: "sexBimbo1", duration: 0.12 },
        { spriteId: "sexBimbo2", duration: 0.12 }
    ],
    sexPlayer: [
        { spriteId: "sexPlayer1", duration: 0.3 },
        { spriteId: "sexPlayer2", duration: 0.3 }
    ],
    sexPlayerFinish: [
        { spriteId: "sexPlayer1", duration: 0.12 },
        { spriteId: "sexPlayer2", duration: 0.12 }
    ],

    water: [
        { spriteId: "water1", duration: 1.5 },
        { spriteId: "water2", duration: 1.5 }
    ],
    fire: [
        { spriteId: "fire1", duration: 0.2 },
        { spriteId: "fire2", duration: 0.2 }
    ],
    glimmer: [
        { spriteId: "glimmer1", duration: 0.5 },
        { spriteId: "glimmer2", duration: 0.5 }
    ]
} satisfies Record<string, AnimationFrame[]>
