class VideoMediaPlayer {
    constructor({ manifestJSON, network, videoComponent }) {
        this.manifestJSON = manifestJSON;
        this.network = network
        this.videoComponent = videoComponent
        this.videoElement = null;
        this.sourceBuffer = null;
        this.activeItem = {}
        this.selected = {}
        this.videoDuration = 0;
    }

    initializeCodec() {
        this.videoElement = document.getElementById("vid")

        const mediaSourceSupported = !!window.MediaSource
        if(!mediaSourceSupported){
            alert('Browser não suportado')
        }

        const codecSupported = MediaSource.isTypeSupported(this.manifestJSON.codec);
        if (!codecSupported){
            alert(`Browser não suporta codec ${this.manifestJSON.codec}`)
        }

        const mediaSource = new MediaSource()
        this.videoElement.src = URL.createObjectURL(mediaSource)

        mediaSource.addEventListener('sourceopen', this.sourceOpenWrapper(mediaSource))
    }

    sourceOpenWrapper(mediaSource){
        return async(_) => {
            this.sourceBuffer = mediaSource.addSourceBuffer(this.manifestJSON.codec)
            const selected = this.selected = this.manifestJSON.inicio
            mediaSource.duration = this.videoDuration

            await this.fileDownload(selected.url)
            setInterval(this.waitForQuestions.bind(this), 200);
            setInterval(this.timeoutQuestions.bind(this), 200)
        }
    }

    waitForQuestions() {
        const currentTime = parseInt(this.videoElement.currentTime)
        const raiseOptions = this.selected.at === currentTime;
        if (!raiseOptions) return;
        
        if(this.activeItem.url === this.selected.url) return;

        const hasOptions = this.selected.options
        const selected = this.selected
        if (hasOptions) this.videoComponent.configureModal({ selected })

        this.activeItem = this.selected;
    }

    timeoutQuestions() {
        const currentTime = parseInt(this.videoElement.currentTime)
        const removeModal = this.selected.endAt === currentTime

        if (!removeModal) return;
        this.nextChunk(this.selected.defaultOption);
    }

    async currentFileResolution(){
        const LOWEST_RESOLUTION = 240
        const prepareURL = {
            url: this.manifestJSON.akanidle.url,
            fileResolution: LOWEST_RESOLUTION,
            fileResolutionTag: this.manifestJSON.fileResolutionTag,
            hostTag: this.manifestJSON.hostTag
        }
        const finalURL = this.network.parseManifestURL(prepareURL)
        return this.network.getProperResolution(finalURL)
    }

    async nextChunk(data){
        this.videoComponent.modal.close()
        const key = data.toLowerCase();
        const selected = this.manifestJSON[key]
        this.selected = {
            ...selected,
            at: parseInt(this.videoElement.duration + selected.at),
            endAt: parseInt(this.videoElement.duration + selected.endAt)
        }
        await this.fileDownload(selected.url)
    }

    async fileDownload(url){
        const fileResolution = await this.currentFileResolution();
        const prepareURL = {
            url,
            fileResolution: fileResolution,
            fileResolutionTag: this.manifestJSON.fileResolutionTag,
            hostTag: this.manifestJSON.hostTag
        }
        const finalURL = this.network.parseManifestURL(prepareURL)
        this.setVideoDuration(finalURL);
        const data = await this.network.fetchFile(finalURL);
        return this.processBufferSegments(data)
    }

    setVideoDuration(url){
        const barSplit = url.split('/')
        const dashSplit = barSplit[barSplit.length - 1].split('-')
        const [name, duration] = [dashSplit[0], dashSplit[dashSplit.length - 2]]
        this.videoDuration += parseFloat(duration)
    }

    async processBufferSegments(allSegments){
        const sourceBuffer = this.sourceBuffer
        sourceBuffer.appendBuffer(allSegments)

        return new Promise((resolve, reject) => {
            const updateEnd = (_) => {
                sourceBuffer.removeEventListener('updateend', updateEnd)
                sourceBuffer.timestampOffset = this.videoDuration

                return resolve()
            }

            sourceBuffer.addEventListener('updateend', updateEnd)
            sourceBuffer.addEventListener('error', reject)

        })
    }


}