function vaiScroll(){
    const div = document.querySelector('#vai-top');

    function scrollDivToBottom() {
        div.scrollTop = div.scrollHeight;
    }

    const observer = new MutationObserver(() => {
        scrollDivToBottom();
    });

    observer.observe(div, { attributes: true, childList: true, characterData: true });
}

(function () {
    class Vai {
        constructor(data = {}) {
            this._version = '0.0.1';
            this._data = data;
            this._i = 0;
            this._speed = data['speed'] || 55;
            this.stopped = false;

            this._body = document.querySelector('body');
            this._body.innerHTML += '<div class="vai-mask"></div><div class="vai" id="vai-module"><a href="#" id="vaiClose" class="vai-close"></a><div class="vai-top" id="vai-top"></div></div>';
            window.vaiScroll();
            this.closeButton();
        }

        close() {
            var elemento = document.getElementsByClassName('vai-mask')[0];
            var paiElemento = elemento.parentNode;
            paiElemento.removeChild(elemento);
            elemento = document.getElementById('vai-module');
            paiElemento = elemento.parentNode;
            paiElemento.removeChild(elemento);

            this.stopped = true;
        }

        closeButton() {
            var callClose = this.close.bind(this);

            document.getElementById('vaiClose').addEventListener('click', function (e) {
                window.vaiClose();
                e.preventDefault();
                callClose();
            })
        }

        typeWriter(element, msg) {
            if(this.stopped == true) {
                return false
            }

            if (this._i < msg.length) {
                element.innerHTML += msg.charAt(this._i);
                this._i++;

                var callTypeWriter = this.typeWriter.bind(this);

                setTimeout(function () {
                    callTypeWriter(element, msg)
                }, this._speed);
            } else {
                this._i = 0;
                element.classList.remove('write');
                this.exibirMensagem(this._msgs);
            }
        }

        insertText(msg) {
            if(this.stopped == true) {
                return false
            }

            var vaiTop = document.getElementById('vai-top');
            var vaiMsg = document.createElement('div');
            vaiMsg.classList.add('vai-msg');
            vaiTop.appendChild(vaiMsg);

            var vaiMsgText = document.createElement('span');
            vaiMsgText.classList.add('vai-msg-text');
            vaiMsgText.classList.add('write');
            vaiMsg.appendChild(vaiMsgText);
            vaiMsgText.innerHTML = '\&nbsp;';

            var callTypeWriter = this.typeWriter.bind(this);

            setTimeout(function () {
                vaiMsg.classList.add('show');
                setTimeout(function () {
                    vaiMsgText.innerHTML = '';
                    callTypeWriter(vaiMsgText, msg);
                }, 200);
            }, 300);
        }

        exibirMensagem() {
            if(this.stopped == true) {
                return false
            }

            if (this._counter < this._msgs.length) {
                this.insertText(this._msgs[this._counter]);
                this._counter++;
            } else {
                var html_btns = '<div class="vai-buttons">';
                this._btns.forEach(element => {
                    html_btns += '<button class="vai-button" onclick="window.loadStep(\'' + element['action'] + '\')">' + element['text'] + '</button>';
                });
                html_btns += '</div>';
                setTimeout(function () {
                    document.getElementById('vai-top').innerHTML += html_btns
                }, 500);
            }
        }

        showMessage(data) {
            if(this.stopped == true) {
                return false
            }
            this._counter = 0;
            this._msgs = data['msgs'];
            this._btns = data['btns'];
            document.getElementById('vai-top').innerHTML = '';

            var callExibirMensagem = this.exibirMensagem.bind(this);

            setTimeout(function () {
                document.getElementById('vai-module').classList.add('show');
                setTimeout(function () {
                    callExibirMensagem(this._msgs);
                }, 200); 
            }, 800);
        }
    }
    window.Vai = Vai;
})();

function loadStep(step = 'default') {
    // se step conter a string 'link_', redireciona para o link_
    if (step.indexOf('link_') > -1) {
        var link = step.replace('link_', '');
        window.open(link);
        return;
    }

    if (step.indexOf('linkclose_') > -1) {
        vaiClose();
        window.Vai.close(); 
        var link = step.replace('linkclose_', '');
        window.open(link);
        return;
    }

    if (step.indexOf('close_vai') > -1) {
        vaiClose();
        window.Vai.close();    
        return;
    }

    if (step.indexOf('save_') > -1) {
        var step_split = step.split('_');
        vaiSave();
        Vai.showMessage(vai_data[step_split[1]]);
        return;
    }

    window.Vai.showMessage(vai_data[step]);
}
