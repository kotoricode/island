import actorVsSrc from "./shaders/actor.vert?raw"
import imageVsSrc from "./shaders/image.vert?raw"

import actorFsSrc from "./shaders/actor.frag?raw"
import pickFsSrc from "./shaders/pick.frag?raw"
import imageFsSrc from "./shaders/image.frag?raw"

import { RESOLUTION, getRenderingContext } from "./dom"
import { AtlasId, getAtlas, getSprite } from "./sprite"
import { getViewProjection, worldToNdc } from "./camera"
import { Actor } from "./actor"
import { getMouseCanvasPosition } from "./mouse"
import { state } from "./state"
import { currentScene, getActors } from "./scene"
import { Vector2 } from "./vector2"

export function render(): void
{
    drawSceneActors()
    blitSceneToImage()
    drawImageToCanvas()
}

export function getPickedColor(): number | null
{
    const mousePosition = getMouseCanvasPosition({ invertY: true })

    if (!mousePosition)
    {
        return null
    }

    gl.enable(gl.SCISSOR_TEST)
    gl.scissor(mousePosition.x, mousePosition.y, 1, 1)

    gl.bindFramebuffer(gl.FRAMEBUFFER, fboPick)
    gl.clearBufferuiv(gl.COLOR, 0, [0, 0, 0, 0])
    gl.useProgram(pickProgram)

    setViewProjection(pickProgram)

    for (const actor of getActors())
    {
        if (!actor.pickColor)
        {
            continue
        }

        setTransform(pickProgram, actor.transform)
        setUvOffset(pickProgram, actor)
        setUvSize(pickProgram, actor)
        setUvRepeat(pickProgram, actor)
        setPickColor(pickProgram, actor.pickColor)
        bindActorTexture(actor)
        drawRectangle()
    }

    const array = new Uint8Array(4)
    gl.readPixels(mousePosition.x, mousePosition.y, 1, 1, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, array, 0)
    gl.disable(gl.SCISSOR_TEST)

    return array[0] || null
}

function drawSceneActors(): void
{
    gl.clearColor(0.3, 0.3, 0.4, 1.0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboScene)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(actorProgram)

    setViewProjection(actorProgram)

    for (const actor of getActors())
    {
        setTransform(actorProgram, actor.transform)
        setUvOffset(actorProgram, actor)
        setUvSize(actorProgram, actor)
        setUvRepeat(actorProgram, actor)
        setHighlightFactor(actorProgram, actor)
        bindActorTexture(actor)
        drawRectangle()
    }
}

function blitSceneToImage(): void
{
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fboScene)
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fboImage)
    gl.blitFramebuffer(
        0, 0, RESOLUTION.x, RESOLUTION.y,
        0, 0, RESOLUTION.x, RESOLUTION.y,
        gl.COLOR_BUFFER_BIT, gl.NEAREST
    )
}

function drawImageToCanvas(): void
{
    gl.useProgram(imageProgram)
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fboImage)
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
    setTimeOfDay(imageProgram)
    setFadeFactor(imageProgram)
    setHasFire(imageProgram)
    setFirePosition(imageProgram)
    gl.bindTexture(gl.TEXTURE_2D, fboImageTexture)
    drawRectangle()
}

function setHighlightFactor(program: WebGLProgram, actor: Actor): void
{
    const highlightFactor = actor.getHighlightColor()
    const uniform = gl.getUniformLocation(program, "u_highlightFactor")
    gl.uniform1f(uniform, highlightFactor)
}

function setTransform(program: WebGLProgram, value: DOMMatrix): void
{
    const uniform = gl.getUniformLocation(program, "u_transform")
    gl.uniformMatrix4fv(uniform, false, value.toFloat32Array())
}

function setViewProjection(program: WebGLProgram): void
{
    const viewProjection = getViewProjection()
    const uniform = gl.getUniformLocation(program, "u_viewProjection")
    gl.uniformMatrix4fv(uniform, false, viewProjection.toFloat32Array())
}

function setUvOffset(program: WebGLProgram, actor: Actor): void
{
    const sprite = getSprite(actor.spriteId)
    const atlas = getAtlas(sprite.atlasId)
    const uniform = gl.getUniformLocation(program, "u_uvOffset")
    const uv = sprite.offset.clone().divide(atlas.size)
    gl.uniform2f(uniform, uv.x, uv.y)
}

function setUvSize(program: WebGLProgram, actor: Actor): void
{
    const sprite = getSprite(actor.spriteId)
    const atlas = getAtlas(sprite.atlasId)
    const uniform = gl.getUniformLocation(program, "u_uvSize")
    const size = sprite.size.clone().divide(atlas.size)
    gl.uniform2f(uniform, size.x, size.y)
}

function setUvRepeat(program: WebGLProgram, actor: Actor): void
{
    const uniform = gl.getUniformLocation(program, "u_uvRepeat")
    gl.uniform2f(uniform, actor.uvRepeat.x, actor.uvRepeat.y)
}

function setPickColor(program: WebGLProgram, pickColor: number): void
{
    const uniform = gl.getUniformLocation(program, "u_pickColor")
    gl.uniform1ui(uniform, pickColor)
}

function setTimeOfDay(program: WebGLProgram): void
{
    const uniform = gl.getUniformLocation(program, "u_timeOfDay")
    gl.uniform1ui(uniform, state.timeOfDay)
}

function setFadeFactor(program: WebGLProgram): void
{
    const uniform = gl.getUniformLocation(program, "u_fadeFactor")
    gl.uniform1f(uniform, state.fadeFactor)
}

function setHasFire(program: WebGLProgram): void
{
    const showFire = Number(state.firePlaced && currentScene === "jungle")
    const uniform = gl.getUniformLocation(program, "u_hasFire")
    gl.uniform1ui(uniform, showFire)
}

function setFirePosition(program: WebGLProgram): void
{
    const vec = new Vector2(18, 113)
    worldToNdc(vec)
    const uniform = gl.getUniformLocation(program, "u_firePosition")
    gl.uniform2f(uniform, vec.x, vec.y)
}

function bindActorTexture(actor: Actor): void
{
    const sprite = getSprite(actor.spriteId)
    const texture = getAtlasTexture(sprite.atlasId)
    gl.bindTexture(gl.TEXTURE_2D, texture)
}

function createShader(type: WebGLRenderingContextStrict.ShaderType, source: string): WebGLShader
{
    const shader = gl.createShader(type)

    if (!shader)
    {
        throw Error("Failed to create shader")
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    return shader
}

function createProgram(vsSource: string, fsSource: string): WebGLProgram
{
    const program = gl.createProgram()

    if (!program)
    {
        throw Error("Failed to create program")
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource)
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource)

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        const info = gl.getProgramInfoLog(program)
        throw Error(info ?? "Invalid program")
    }

    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    return program
}

function drawRectangle(): void
{
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const gl = getRenderingContext()
gl.clearColor(0.3, 0.3, 0.4, 1.0)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.disable(gl.DEPTH_TEST)

const actorProgram = createProgram(actorVsSrc, actorFsSrc)
const pickProgram = createProgram(actorVsSrc, pickFsSrc)
const imageProgram = createProgram(imageVsSrc, imageFsSrc)

const fboScene = gl.createFramebuffer()
const rboColor = gl.createRenderbuffer()
gl.bindFramebuffer(gl.FRAMEBUFFER, fboScene)
gl.bindRenderbuffer(gl.RENDERBUFFER, rboColor)
gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGB8, RESOLUTION.x, RESOLUTION.y)
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rboColor)

const fboPick = gl.createFramebuffer()
const fboPickTexture = createFramebufferTexture(gl.RGBA8UI)
gl.bindFramebuffer(gl.FRAMEBUFFER, fboPick)
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboPickTexture, 0)

const fboImage = gl.createFramebuffer()
const fboImageTexture = createFramebufferTexture(gl.RGBA8)
gl.bindFramebuffer(gl.FRAMEBUFFER, fboImage)
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboImageTexture, 0)

const atlasTextures = new Map<AtlasId, WebGLTexture>()

function getAtlasTexture(source: AtlasId): WebGLTexture
{
    const cached = atlasTextures.get(source)

    if (cached)
    {
        return cached
    }

    const texture = createTexture()
    atlasTextures.set(source, texture)

    const image = new Image()
    image.src = source
    image.addEventListener("load", () => setTextureImage(texture, image), { once: true })

    return texture
}

function createFramebufferTexture(internalFormat: WebGL2RenderingContextStrict.TextureInternalFormat): WebGLTexture
{
    const gl = getRenderingContext()
    const texture = createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, RESOLUTION.x, RESOLUTION.y)

    return texture
}

async function setTextureImage(texture: WebGLTexture, image: HTMLImageElement): Promise<void>
{
    const bitmap = await createImageBitmap(image)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}

function createTexture(): WebGLTexture
{
    const texture = gl.createTexture()

    if (!texture)
    {
        throw Error("Failed to create texture")
    }

    return texture
}
