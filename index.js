let palavraSecreta = '';
let erros = 0;
let maxErros = 6;
let jogoFinalizado = false;
let palavrasTentadas = [];

let painelInicial = document.getElementById('painel-inicial');
let painelJogo = document.getElementById('painel-jogo');

let campoSecreto = document.getElementById('palavra-secreta');
let campoPalpite = document.getElementById('palpite');

let botaoIniciar = document.getElementById('iniciar');
let botaoEnviar = document.getElementById('enviar');
let botaoReiniciar = document.getElementById('reiniciar');

let tabuleiro = document.getElementById('tabuleiro');


let textoTentativas = document.getElementById('tentativas');
let textoMensagem = document.getElementById('mensagem');
let erroPainel = document.getElementById('erro-painel');

// Verifica se os elementos do HTML existem
if (
    !painelInicial || !painelJogo ||
    !campoSecreto || !campoPalpite ||
    !botaoIniciar || !botaoEnviar ||
    !botaoReiniciar || !tabuleiro || !textoTentativas ||
    !textoMensagem || !erroPainel
) {
    console.error('Erro: confira os IDs dos elementos no HTML.');
} else {

    // Remove acentos e transforma em letras maiúsculas
    function normalizar(palavra) {

        return palavra
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .trim();

    }

    // Inicia uma nova partida
    function iniciarJogo() {

        let palavraDigitada = normalizar(campoSecreto.value);

        if (!/^[A-Z]{5}$/.test(palavraDigitada)) {

            erroPainel.textContent =
                'Digite somente letras, 5 caracteres!';

            return;

        }

        palavraSecreta = palavraDigitada;

        erros = 0;
        jogoFinalizado = false;
        palavrasTentadas = [];

        tabuleiro.innerHTML = '';

        textoTentativas.textContent = 'Tentativas: 0 de 6';

        textoMensagem.textContent = '';
        textoMensagem.style.color = 'white';

        erroPainel.textContent = '';

        campoPalpite.value = '';
        campoPalpite.maxLength = palavraSecreta.length;

   

        painelInicial.classList.add('escondido');
        painelJogo.classList.remove('escondido');

        campoPalpite.focus();

    }

    // Envia a tentativa do jogador
    function verificarPalavra() {

        if (jogoFinalizado) {
            return;
        }

        let palpite = normalizar(campoPalpite.value);

        if (!/^[A-Z]+$/.test(palpite)) {

            textoMensagem.textContent =
                'Digite uma palavra usando somente letras!';

            return;

        }

        if (palpite.length !== palavraSecreta.length) {

            textoMensagem.textContent =
                'Digite uma palavra com ' +
                palavraSecreta.length + ' letras!';

            return;

        }

        if (palavrasTentadas.includes(palpite)) {

            textoMensagem.textContent = 'Você já tentou essa palavra!';

            campoPalpite.value = '';
            campoPalpite.focus();

            return;

        }

        palavrasTentadas.push(palpite);

        criarLinha(palpite);

        // Verifica se acertou
        if (palpite === palavraSecreta) {

            textoMensagem.textContent = 'Parabéns! Você acertou!';
            textoMensagem.style.color = '#538d4e';

            jogoFinalizado = true;

            campoPalpite.disabled = true;
            botaoEnviar.disabled = true;

            return;

        }

        // Se errou, aumenta as tentativas
        erros++;



        textoTentativas.textContent =
            'Tentativas: ' + erros + ' de ' + maxErros;

        textoMensagem.textContent = 'Palavra incorreta! Tente novamente.';
        textoMensagem.style.color = 'white';

        campoPalpite.value = '';

        // Verifica se perdeu
        if (erros === maxErros) {

            textoMensagem.textContent =
                'Fim de jogo! A palavra era: ' + palavraSecreta;

            textoMensagem.style.color = '#ff5555';

            jogoFinalizado = true;

            campoPalpite.disabled = true;
            botaoEnviar.disabled = true;

            return;

        }

        campoPalpite.focus();

    }

    // Cria os quadrados e aplica as cores
    function criarLinha(palpite) {

        let linha = document.createElement('div');

        linha.className = 'linha';

        let letrasRestantes = palavraSecreta.split('');
        let quadrados = [];

        // Primeiro verifica as letras na posição correta
        for (let i = 0; i < palpite.length; i++) {

            let quadrado = document.createElement('div');

            quadrado.className = 'quadrado';
            quadrado.textContent = palpite[i];

            quadrados.push(quadrado);

            if (palpite[i] === palavraSecreta[i]) {

                quadrado.classList.add('correto');

                letrasRestantes[i] = null;

            }

        }

        // Depois verifica as letras em outras posições
        for (let i = 0; i < palpite.length; i++) {

            if (quadrados[i].classList.contains('correto')) {
                continue;
            }

            let posicao = letrasRestantes.indexOf(palpite[i]);

            if (posicao !== -1) {

                quadrados[i].classList.add('existe');

                letrasRestantes[posicao] = null;

            } else {

                quadrados[i].classList.add('errado');

            }

        }

        // Coloca os quadrados dentro da linha
        quadrados.forEach(function (quadrado) {

            linha.appendChild(quadrado);

        });

        tabuleiro.appendChild(linha);

    }

    // Volta para o painel inicial
    function voltarPainel() {

        painelJogo.classList.add('escondido');
        painelInicial.classList.remove('escondido');

        campoSecreto.value = '';
        campoPalpite.value = '';

        campoPalpite.disabled = false;
        botaoEnviar.disabled = false;

        tabuleiro.innerHTML = '';

        textoMensagem.textContent = '';
        textoTentativas.textContent = 'Tentativas: 0 de 6';

        erroPainel.textContent = '';

        campoSecreto.focus();

    }

    // Eventos dos botões
    botaoIniciar.addEventListener('click', iniciarJogo);

    botaoEnviar.addEventListener('click', verificarPalavra);

    botaoReiniciar.addEventListener('click', voltarPainel);

    // Enter no campo da palavra secreta
    campoSecreto.addEventListener('keydown', function (evento) {

        if (evento.key === 'Enter') {

            evento.preventDefault();

            iniciarJogo();

        }

    });

    // Enter no campo das tentativas
    campoPalpite.addEventListener('keydown', function (evento) {

        if (evento.key === 'Enter') {

            evento.preventDefault();

            verificarPalavra();

        }

    });

}