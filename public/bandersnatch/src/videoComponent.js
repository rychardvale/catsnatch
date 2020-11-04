class VideoComponent {
    constructor(){
        this.modal = {}
    }

    initializePlayer(){
        const player = videojs('vid');
        const ModalDialog = videojs.getComponent('ModalDialog');
        const modal = new ModalDialog(player, {
            temporary: false, 
            closeable: true,
            pauseOnOpen: false,
        });
    
        player.addChild(modal);
        player.on('play', () => modal.close())
        this.modal = modal
    }

    configureModal({ selected }){
        const modal = this.modal;
        modal.on('modalopen', this.getModalTemplate(selected.options, selected.description, modal));
        modal.open()
        this.triggerProgressBar(selected.at, selected.endAt);
    }

    getModalTemplate(options, descriptions, modal){
        return (_) => {
            const [option1, option2] = options
            const [description1, description2] = descriptions
            const htmlTemplate = `
                <div class='overlay'>
                    <div class="videoButtonWrapper">
                        <button class='btn btn-dark' onclick="window.nextChunk('${option1}')">
                            ${description1}
                        </button>
                        <button class='btn btn-dark' onclick="window.nextChunk('${option2}')">
                            ${description2}
                        </button>
                    </div>
                    <div class="progress bg-transparent"  style="height: 2px;width: 500px;">
                        <div class="progress-bar" id="progressbar" role="progressbar" style="background: #b7090b;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            `;
            modal.contentEl().innerHTML = htmlTemplate;
        }
    }

    triggerProgressBar(start, end){
        const durationInCs = (end - start)*100
        const progressPace = 700/durationInCs // 700 para ter um gap
        const startAt = Date.now()

        const progressInterval = setInterval(() => {
            const dps = Date.now()
            const delta = (dps - startAt)/10;
            $('#progressbar').css('width', delta * progressPace + 'px');

            if (delta > durationInCs) clearInterval(progressInterval);
        }, 100);

    }
}