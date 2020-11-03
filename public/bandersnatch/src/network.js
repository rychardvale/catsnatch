class Network {
    constructor({ host }){
        this.host = host
    }

    parseManifestURL({url, fileResolution, fileResolutionTag, hostTag}) {
        return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
    }

    async fetchFile(url){
        const response = await fetch(url)
        console.log('fetching ', url);
        return response.arrayBuffer()
    }

    async getProperResolution(url){
        const startMs = Date.now()
        const response = await fetch(url)
        await response.arrayBuffer()
        const endMs = Date.now()
        const durationInMs = (endMs - startMs)

        const resolutions = [
            {start: 3001, end: 20000, resolution: 144},
            {start: 901, end: 3000, resolution: 480},
            {start: 0, end: 900, resolution: 720}
        ]

        const bestResolution = resolutions.find( item => {
            return item.start <= durationInMs && item.end >= durationInMs
        });
        
        const LOWEST_RESOLUTION = 240
        if (!bestResolution) return LOWEST_RESOLUTION

        return bestResolution.resolution
    }
}