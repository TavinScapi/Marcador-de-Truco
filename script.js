document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const team1 = document.getElementById('team1');
    const team2 = document.getElementById('team2');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    const trucoStatus1 = document.getElementById('trucoStatus1');
    const trucoStatus2 = document.getElementById('trucoStatus2');
    const victories1 = document.getElementById('victories1');
    const victories2 = document.getElementById('victories2');
    const victoryModal = document.getElementById('victoryModal');
    const victoryTeamName = document.getElementById('victoryTeamName');
    const closeVictory = document.getElementById('closeVictory');
    const resetPointsBtn = document.getElementById('resetPoints');
    const resetVictoriesBtn = document.getElementById('resetVictories');
    const editIcons = document.querySelectorAll('.edit-icon');

    // Estado do jogo
    let scores = {
        team1: 0,
        team2: 0
    };

    let victories = {
        team1: 0,
        team2: 0
    };

    const trucoValues = [3, 6, 9, 12];
    let trucoIndex = 0;
    let trucoAtivo = false;
    let valorMarcador = 1;

    const mainTrucoBtn = document.getElementById('mainTrucoBtn');
    const runBtn = document.getElementById('runBtn');

    // Função para atualizar texto dos botões +1
    function atualizarMarcadores() {
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.textContent = `+${valorMarcador}`;
        });
    }

    // Função para iniciar rodada de truco
    mainTrucoBtn.addEventListener('click', function () {
        const banner = document.getElementById('trucoBanner');
        const bannerText = document.getElementById('trucoBannerText');
        let texto = '';
        if (!trucoAtivo) {
            trucoAtivo = true;
            trucoIndex = 0;
            valorMarcador = trucoValues[trucoIndex];
            atualizarMarcadores();
            mainTrucoBtn.textContent = trucoValues[trucoIndex + 1] ? trucoValues[trucoIndex + 1] : 'Truco';
            runBtn.style.display = 'inline-block';
            trucoStatus1.textContent = 'Rodada de Truco!';
            trucoStatus2.textContent = 'Rodada de Truco!';
            texto = 'TRUCO!';
        } else if (trucoIndex < trucoValues.length - 1) {
            trucoIndex++;
            valorMarcador = trucoValues[trucoIndex];
            mainTrucoBtn.textContent = trucoValues[trucoIndex + 1] ? trucoValues[trucoIndex + 1] : trucoValues[trucoIndex];
            atualizarMarcadores();
            if (trucoIndex === 1) texto = 'SEIS!';
            else if (trucoIndex === 2) texto = 'NOVE!';
            else if (trucoIndex === 3) texto = 'DOZE!';
        }
        // Mostra banner se for pedido novo
        if (texto) {
            bannerText.textContent = texto;
            banner.style.display = 'block';
            banner.style.animation = 'none';
            void banner.offsetWidth; // reinicia animação
            banner.style.animation = '';

            // Confetes animados
            for (let i = 0; i < 25; i++) {
                const particle = document.createElement('div');
                particle.classList.add('truco-particle');
                // cores variadas
                particle.style.background = ['#f1c40f', '#e67e22', '#e74c3c'][Math.floor(Math.random() * 3)];
                particle.style.left = `${50 + (Math.random() * 40 - 20)}%`;
                particle.style.top = `40px`;
                particle.style.transform = `translateX(-50%)`;
                particle.style.animationDelay = `${Math.random() * 0.3}s`;
                particle.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
                document.body.appendChild(particle);
                // remover depois da animação
                setTimeout(() => particle.remove(), 1500);
            }

            setTimeout(() => {
                banner.style.display = 'none';
            }, 1500);
        }

    });

    // Botão de correr
    runBtn.addEventListener('click', function () {
        // Quem clicar, o adversário ganha os pontos anteriores
        const runValue = trucoIndex > 0 ? trucoValues[trucoIndex - 1] : 1;
        // Você pode escolher qual time ganha, aqui exemplo: Time 1 ganha
        updateScore(1, scores.team1 + runValue, 'increase');
        // Resetar truco
        trucoAtivo = false;
        valorMarcador = 1;
        atualizarMarcadores();
        mainTrucoBtn.textContent = 'Truco';
        runBtn.style.display = 'none';
        trucoStatus1.textContent = '';
        trucoStatus2.textContent = '';
    });

    // Função para atualizar a pontuação na tela
    function updateScore(team, newScore, animation) {
        const scoreElement = team === 1 ? score1 : score2;
        scores[`team${team}`] = newScore;
        scoreElement.textContent = newScore;

        // Aplicar animação
        if (animation) {
            scoreElement.classList.remove('increase', 'decrease');
            void scoreElement.offsetWidth; // Trigger reflow
            scoreElement.classList.add(animation);

            // Remover classe de animação após a animação terminar
            setTimeout(() => {
                scoreElement.classList.remove(animation);
            }, 500);
        }

        // Verificar vitória
        if (newScore >= 12) {
            showVictory(team);
        }

        // Atualizar destaque do time ativo
        highlightActiveTeam();
    }

    // Função para mostrar modal de vitória
    function showVictory(winningTeam) {
        const teamName = document.querySelector(`#team${winningTeam} .team-name`).value;
        victoryTeamName.textContent = teamName;
        victoryModal.classList.add('active');

        // Atualizar vitórias
        victories[`team${winningTeam}`]++;
        updateVictoriesDisplay();

        // Zerar pontos
        scores.team1 = 0;
        scores.team2 = 0;
        score1.textContent = '0';
        score2.textContent = '0';
    }

    // Função para atualizar a exibição das vitórias
    function updateVictoriesDisplay() {
        const stars1 = victories1.querySelectorAll('.victory-star');
        const stars2 = victories2.querySelectorAll('.victory-star');

        stars1.forEach((star, index) => {
            star.classList.toggle('active', index < victories.team1);
        });

        stars2.forEach((star, index) => {
            star.classList.toggle('active', index < victories.team2);
        });
    }

    // Função para aumentar pontos
    function increasePoints(team) {
        const newScore = scores[`team${team}`] + 1;
        if (newScore <= 12) {
            updateScore(team, newScore, 'increase');
        }
    }

    // Função para diminuir pontos
    function decreasePoints(team) {
        const newScore = Math.max(0, scores[`team${team}`] - 1);
        updateScore(team, newScore, 'decrease');
    }

    // Função para destacar time ativo (com mais pontos)
    function highlightActiveTeam() {
        if (scores.team1 > scores.team2) {
            team1.classList.add('active');
            team2.classList.remove('active');
        } else if (scores.team2 > scores.team1) {
            team2.classList.add('active');
            team1.classList.remove('active');
        } else {
            team1.classList.remove('active');
            team2.classList.remove('active');
        }
    }

    // Event Listeners
    // Aumentar pontos
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const team = this.closest('.team').id === 'team1' ? 1 : 2;
            const newScore = scores[`team${team}`] + valorMarcador;
            if (newScore <= 12) {
                updateScore(team, newScore, 'increase');
                // Após aumentar, se truco estava ativo, volta ao normal
                if (trucoAtivo) {
                    trucoAtivo = false;
                    valorMarcador = 1;
                    atualizarMarcadores();
                    mainTrucoBtn.textContent = 'Truco';
                    runBtn.style.display = 'none';
                    trucoStatus1.textContent = '';
                    trucoStatus2.textContent = '';
                }
            }
        });
    });

    // Diminuir pontos
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const team = this.closest('.team').id === 'team1' ? 1 : 2;
            decreasePoints(team);
        });
    });

    // Fechar modal de vitória
    closeVictory.addEventListener('click', function () {
        victoryModal.classList.remove('active');
    });

    // Zerar pontos
    resetPointsBtn.addEventListener('click', function () {
        scores.team1 = 0;
        scores.team2 = 0;
        score1.textContent = '0';
        score2.textContent = '0';
        // Atualizar destaque
        highlightActiveTeam();
    });

    // Zerar vitórias
    resetVictoriesBtn.addEventListener('click', function () {
        victories.team1 = 0;
        victories.team2 = 0;
        updateVictoriesDisplay();
    });

    // Ícones de edição
    editIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.focus();
            input.select();
        });
    });

    // Fechar modal de vitória ao clicar fora
    victoryModal.addEventListener('click', function (e) {
        if (e.target === victoryModal) {
            victoryModal.classList.remove('active');
        }
    });

    // Inicializar destaque do time ativo
    highlightActiveTeam();
});
