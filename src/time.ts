let deltaTime = 0
let runTime = 0
let timestamp = 0
const MAX_DELTA_TIME = 0.1

export function updateTimestamp(newTimestamp: number): void
{
    deltaTime = Math.min((newTimestamp - timestamp) / 1000, MAX_DELTA_TIME)
    runTime += deltaTime
    timestamp = newTimestamp
}

export function getDeltaTime(): number
{
    return deltaTime
}

export function getRunTime(): number
{
    return runTime
}
