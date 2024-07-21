import { Quad } from "./quad"
import { clamp } from "./common"
import { RESOLUTION } from "./dom"
import { Vector2 } from "./vector2"

export function updateCamera(): void
{
    viewMatrix = DOMMatrix.fromMatrix(transform).inverse()
    viewProjection = DOMMatrix.fromMatrix(projectionMatrix).multiply(viewMatrix)
    inverseViewProjection = DOMMatrix.fromMatrix(viewProjection).inverse()
}

export function ndcToWorld(vec: Vector2): void
{
    const { m11, m12, m14, m21, m22, m24, m41, m42, m44 } = inverseViewProjection
    const { x, y } = vec

    const w = m14 * x + m24 * y + m44
    vec.x = (m11 * x + m21 * y + m41) / w
    vec.y = (m12 * x + m22 * y + m42) / w
}

export function worldToNdc(vec: Vector2): void
{
    const { x, y } = vec
    const { m11, m12, m14, m21, m22, m24, m31, m32, m34, m41, m42, m44 } = viewProjection

    const w = m14 * x + m24 * y + m34 * y + m44
    const ndcX = (m11 * x + m21 * y + m31 * y + m41) / w
    const ndcY = (m12 * x + m22 * y + m32 * y + m42) / w

    vec.x = ndcX / 2 + 0.5
    vec.y = ndcY / 2 + 0.5
}

export function getViewProjection(): DOMMatrix
{
    return viewProjection
}

export function updateCameraTransform(position: Vector2): void
{
    if (bounds)
    {
        transform.m41 = clamp(position.x, bounds.left + RESOLUTION.x / 2, bounds.right - RESOLUTION.x / 2)
        transform.m42 = clamp(position.y, bounds.bottom + RESOLUTION.y / 2, bounds.top - RESOLUTION.y / 2)
    }
    else
    {
        transform.m41 = position.x
        transform.m42 = position.y
    }
}

export function setCameraBounds(bounds_: Quad): void
{
    bounds = bounds_
}

function createProjectionMatrix(): DOMMatrix
{
    const near = -1
    const far = 1
    const depth = far - near

    const m0 = 2 / RESOLUTION.x
    const m5 = 2 / RESOLUTION.y
    const ma = -2 / depth
    const me = -(far + near) / depth

    return new DOMMatrix([
        m0, 0, 0, 0,
        0, m5, 0, 0,
        0, 0, ma, 0,
        0, 0, me, 1
    ])
}

let viewMatrix = new DOMMatrix()
let viewProjection = new DOMMatrix()
let inverseViewProjection = new DOMMatrix()
const projectionMatrix = createProjectionMatrix()
const transform = new DOMMatrix()
let bounds: Quad | null = null

