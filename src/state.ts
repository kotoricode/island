export const TIME_OF_DAY = <const>{
    DAY: 0,
    EVENING: 1,
    NIGHT: 2
}

export const state = {
    playerControl: false,
    timeOfDay: <number>TIME_OF_DAY.DAY,
    hasFlint: false,
    hasTorch: false,
    hasKey: false,
    hasFlareGun: false,
    hasWestBeachTuna: false,
    hasCapeTuna: false,
    hasRocksTuna: false,
    affection: 0,
    fadeFactor: 1,
    witnessSexBimbo: false,
    doucheIntro: false,
    bimboIntro: false,
    doucheFoundAllTuna: false,
    gatherAtJungle: false,
    searchForFlint: false,
    firePlaced: false,
    gatherAtShack: false,
    doucheTalkedAfterFlareGun: false,
    gatherAtCape: false,
    enteredShack: false
}

export function getFoundTunaCount(): number
{
    return Number(state.hasWestBeachTuna) + Number(state.hasCapeTuna) + Number(state.hasRocksTuna)
}
