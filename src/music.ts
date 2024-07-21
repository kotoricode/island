type Music = {
    context: AudioContext
    bufferSource: AudioBufferSourceNode
}

let currentMusic: string | null = null
let audio: Music | null = null

export function playMusic(file: string | null): void
{
    currentMusic = file

    if (!currentMusic)
    {
        return
    }

    if (audio)
    {
        playCurrentMusic()
    }
}

export function addInitAudioListener(): void
{
    document.addEventListener("click", () =>
    {
        initAudio()
    }, { once: true })
}

function initAudio(): void
{
    const context = new AudioContext()
    const bufferSource = context.createBufferSource()

    audio = {
        context,
        bufferSource
    }

    bufferSource.loop = true
    bufferSource.connect(context.destination)
}

async function playCurrentMusic(): Promise<void>
{
    if (!currentMusic || !audio)
    {
        return
    }

    const audioBuffer = await fetchAudioData(currentMusic)

    if (audio.bufferSource.buffer)
    {
        audio.bufferSource.stop()
        audio.bufferSource = audio.context.createBufferSource()
        audio.bufferSource.loop = true
        audio.bufferSource.connect(audio.context.destination)
    }

    audio.bufferSource.buffer = audioBuffer
    audio.bufferSource.start(audio.context.currentTime)
}

async function fetchAudioData(file: string): Promise<AudioBuffer>
{
    const cached = audioDataCache.get(file)

    if (cached)
    {
        return cached
    }

    if (!audio)
    {
        throw Error("Missing audio")
    }

    const res = await fetch(file)
    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = await audio.context.decodeAudioData(arrayBuffer)
    audioDataCache.set(file, audioBuffer)

    return audioBuffer
}

const audioDataCache = new Map<string, AudioBuffer>()
