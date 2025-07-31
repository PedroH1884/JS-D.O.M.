document.addEventListener('DOMContentLoaded', () => {

    const menu = document.querySelector('.menu');
    const telaJogo = document.getElementById('game');
    const telaFimDeJogo = document.getElementById('game-over-screen');
    const botaoIniciar = document.getElementById('iniciar');
    const campoNome = document.getElementById('nome');
    const exibicaoPontos = document.getElementById('score');
    const exibicaoTempo = document.getElementById('time');
    const exibicaoNomeCor = document.getElementById('color-name');
    const celulas = document.querySelectorAll('.cell');
    
    const exibicaoPontosFinais = document.getElementById('final-score');
    const botaoJogarNovamente = document.getElementById('play-again-button');
    const botaoVerRanking = document.getElementById('view-rank-button');
    const modalRanking = document.getElementById('janela1');
    const modalComoJogar = document.getElementById('janela2');
    const botaoRanking = document.getElementById('rank');
    const botaoComoJogar = document.getElementById('comojogar');
    const botoesFechar = document.querySelectorAll('.fechar');
    const listaRanking = document.getElementById('ranking-list');

    let pontos = 0;
    let tempoRestante = 5;
    let tempoInicial = 5;
    let intervaloDoTimer;
    let corAtual = '';
    let nomeJogador = '';

    function salvarPontuacao(nome, pontuacao) {
        const rankings = JSON.parse(localStorage.getItem('colorGameRankings')) || [];
        rankings.push({ name: nome, score: pontuacao });
        rankings.sort((a, b) => b.score - a.score);
        const top10 = rankings.slice(0, 10);
        localStorage.setItem('colorGameRankings', JSON.stringify(top10));
    }

    function atualizarExibicaoRanking() {
        const rankings = JSON.parse(localStorage.getItem('colorGameRankings')) || [];
        listaRanking.innerHTML = '';

        if (rankings.length === 0) {
            listaRanking.innerHTML = '<li>Ninguém jogou ainda. Seja o primeiro!</li>';
            return;
        }

        rankings.forEach((jogador, indice) => {
            const itemLista = document.createElement('li');
            itemLista.textContent = `${indice + 1}. ${jogador.name} - ${jogador.score} pontos`;
            listaRanking.appendChild(itemLista);
        });
    }

    function iniciarJogo() {
        menu.style.display = 'none';
        telaFimDeJogo.style.display = 'none';
        telaJogo.style.display = 'flex';

        pontos = 0;
        tempoInicial = 5;
        
        iniciarNovaRodada();
    }

    botaoRanking.addEventListener('click', () => {
        atualizarExibicaoRanking();
        modalRanking.style.display = 'flex';
    });

    botaoComoJogar.addEventListener('click', () => { 
        modalComoJogar.style.display = 'flex'; 
    });
    
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', () => {
            modalRanking.style.display = 'none';
            modalComoJogar.style.display = 'none';
            menu.style.display = 'flex';
        });
    });

    botaoJogarNovamente.addEventListener('click', () => {
        iniciarJogo();
    });

    botaoVerRanking.addEventListener('click', () => {
        telaFimDeJogo.style.display = 'none';
        atualizarExibicaoRanking();
        modalRanking.style.display = 'flex';
    });
    
    botaoIniciar.addEventListener('click', () => {
        nomeJogador = campoNome.value;
        if (!nomeJogador) { 
            alert("Por favor, insira seu nome para começar!"); 
            return; 
        }
        iniciarJogo();
    });

    celulas.forEach(celula => { 
        celula.addEventListener('click', verificarCor); 
    });
    
    function embaralharArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function iniciarNovaRodada() {
        clearInterval(intervaloDoTimer);
        tempoRestante = tempoInicial;
        atualizarExibicao();

        let cores = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "gray"];
        const nomesDasCores = {
            red: "VERMELHO", green: "VERDE", blue: "AZUL", yellow: "AMARELO",
            orange: "LARANJA", purple: "ROXO", pink: "ROSA", brown: "MARROM", gray: "CINZA"
        };
        
        embaralharArray(cores);

        celulas.forEach((celula, indice) => {
            const cor = cores[indice];
            celula.setAttribute('data-color', cor);
            celula.style.backgroundColor = cor;
        });

        corAtual = cores[Math.floor(Math.random() * cores.length)];
        exibicaoNomeCor.textContent = nomesDasCores[corAtual];

        intervaloDoTimer = setInterval(() => {
            tempoRestante--;
            atualizarExibicao();
            if (tempoRestante <= 0) { 
                finalizarJogo(); 
            }
        }, 1000);
    }

    function verificarCor(evento) {
        if (tempoRestante <= 0) return;

        const corSelecionada = evento.target.getAttribute('data-color');
        if (corSelecionada === corAtual) {
            pontos++;
            if (pontos > 0 && pontos % 5 === 0) { 
                tempoInicial = Math.max(0.5, tempoInicial - 1); 
            }
        } else {
            pontos = Math.max(0, pontos - 1);
        }
        iniciarNovaRodada();
    }

    function atualizarExibicao() {
        exibicaoPontos.textContent = `Pontuação: ${pontos}`;
        exibicaoTempo.textContent = `Tempo: ${tempoRestante}s`;
    }

    function finalizarJogo() {
        clearInterval(intervaloDoTimer);
        salvarPontuacao(nomeJogador, pontos);
        exibicaoPontosFinais.textContent = pontos;
        
        telaJogo.style.display = 'none';
        telaFimDeJogo.style.display = 'flex';
    }

    atualizarExibicaoRanking();

});