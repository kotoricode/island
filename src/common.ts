export function clamp(value: number, min: number, max: number): number
{
    return Math.min(max, Math.max(min, value))
}

export function lerp(min: number, max: number, t: number): number
{
    return (1 - t) * min + t * max
}

export function smoothstep(x: number): number
{
    return x * x * (3.0 - 2.0 * x)
}

export function pingpong(value: number): number
{
    const fract = value % 1

    return value & 1 ? 1 - fract : fract
}

export type Script = {
    done: boolean
    run: () => void
}
