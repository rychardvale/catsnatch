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

    configureModal(optionSelected, descriptions){
        const modal = this.modal;
        modal.on('modalopen', this.getModalTemplate(optionSelected, descriptions, modal))
        modal.open()
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
                </div>
            `;
            modal.contentEl().innerHTML = htmlTemplate;
        }
    }
}