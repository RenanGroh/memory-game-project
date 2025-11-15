const nCards = 8;
let cards = [];
// const attemptsSpan = document.getElementById('attempts');
// const board = document.getElementById("board")
let attemptsSpan;
let board;

function createCard(value) {
  const memoryCard = document.createElement("div");
  memoryCard.classList.add("memory-card");
  memoryCard.dataset.cardValue = value;

  const frontFace = document.createElement("div")
  frontFace.classList.add("front-face");
  const backFace = document.createElement("div")
  backFace.classList.add("back-face");

  const frontParagraph = document.createElement("p");
  const backParagraph = document.createElement("p");

  frontParagraph.textContent = value;
  backParagraph.textContent = "?";

  frontFace.appendChild(frontParagraph);
  backFace.appendChild(backParagraph);
  memoryCard.appendChild(frontFace);
  memoryCard.appendChild(backFace);

  return (memoryCard);
}


let hasFlippedCard = false;
let lockBoard = false; // Bloqueia o tabuleiro para evitar cliques rápidos
let firstCard, secondCard;
let attempts = 0;
let matchedPairs = 0; // Contador de pares encontrados

function flipCard() {
  // Se o tabuleiro estiver bloqueado ou a carta clicada for a mesma, ignora o clique
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip'); // Adiciona a classe 'flip' à carta clicada

  if (!hasFlippedCard) {
    // Primeiro clique
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // Segundo clique
  secondCard = this;
  hasFlippedCard = false; // Reseta para o próximo turno

  checkForMatch();
}

function checkForMatch() {
  // Incrementa o contador de tentativas
  attempts++;
  attemptsSpan.textContent = attempts;

  // Verifica se os data-attributes das duas cartas são iguais
  let isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;

  // Se for um par, desabilita as cartas. Se não, vira-as de volta.
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  // Marca como encontrada para persistência
  firstCard.classList.add('found');
  secondCard.classList.add('found');

  // Remove o ouvinte de evento para que as cartas não possam mais ser clicadas
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  // Incrementa o contador de pares
  matchedPairs++;

  // Salva o estado após encontrar par
  saveGameState();

  // Verifica se o jogo terminou (todos os pares encontrados)
  if (matchedPairs === nCards) {
    // Limpa estado salvo pois o jogo terminou
    clearGameState();
    // Atraso para o jogador ver a última carta virar
    setTimeout(endGame, 1000);
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true; // Bloqueia o tabuleiro

  // Após 1.5 segundos, remove a classe 'flip' para virar as cartas de volta
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();

    // Salva o estado após virar as cartas de volta (tentativa consumida)
    saveGameState();
  }, 1500);
}

function resetBoard() {
  // Reseta as variáveis de estado do jogo
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}


// Adiciona o evento de clique a cada uma das cartas
function bindCardListeners() {
  cards.forEach(card => {
    if (!card.classList.contains('found')) {
      card.addEventListener('click', flipCard);
    }
  });
}


// ===================================================================
// NOVO: FUNÇÕES DE FIM DE JOGO E SALVAMENTO
// ===================================================================

function endGame() {
  // Desabilita o tabuleiro
  lockBoard = true;

  // Limpa estado salvo ao finalizar (garante que não haverá restauração)
  clearGameState();

  const playerName = prompt(`Parabéns! Você completou o jogo em ${attempts} tentativas.\n\nDigite seu nome para salvar:`);

  if (playerName && playerName.trim() !== "") {
    // Chama o método de salvamento
    saveScoreByAjax(playerName);
    // Para testar o método 2 (formulário), descomente a linha abaixo:
    // saveScoreByForm(playerName);
  } else {
    // Se o usuário cancelar
    alert("Pontuação não salva. Reiniciando o jogo.");
    // MODIFICADO: Redireciona para a página de jogar
    window.location.href = 'index.php?page=jogar';
  }

  localStorage.removeItem('memoryGameState');
}

/**
 * MÉTODO 1: Salvar pontuação usando AJAX (Fetch API)
 */
function saveScoreByAjax(playerName) {
  const formData = new FormData();
  formData.append('nome', playerName);
  formData.append('tentativas', attempts);

  console.log("Enviando (AJAX):", playerName, attempts);

  fetch('salvar_pontuacao.php', {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Resposta do servidor (AJAX):', data.message);

      // MODIFICADO: Redireciona para a página de placar após salvar
      alert("Pontuação salva! Redirecionando para o placar.");
      window.location.href = 'index.php?page=placar';
    })
    .catch(error => {
      console.error('Falha ao salvar pontuação via AJAX:', error);
      alert('Houve um erro ao salvar sua pontuação. Verifique o console.');
      // MODIFICADO: Redireciona de volta para o jogo em caso de erro
      window.location.href = 'index.php?page=jogar';
    });
}


/**
 * MÉTODO 2: Salvar pontuação usando envio de Formulário Oculto (Comentado)
 */
/*
function saveScoreByForm(playerName) {
  console.log("Enviando (Formulário Oculto):", playerName, attempts);

  // Preenche os campos ocultos
  document.getElementById('hiddenName').value = playerName;
  document.getElementById('hiddenAttempts').value = attempts;
  
  // Submete o formulário.
  // O 'salvar_pontuacao.php' foi atualizado para redirecionar
  // para 'index.php?page=placar' após a submissão.
  document.getElementById('scoreForm').submit();
}
*/


// ===================================================================
// FUNÇÕES DE PERSISTÊNCIA DO ESTADO DO JOGO
// ===================================================================

// Função para salvar o estado do jogo
function saveGameState() {
  // cardOrder: valores das cartas na ordem do array 'cards'
  const cardOrder = Array.from(cards).map(c => Number(c.dataset.cardValue));
  // cardOrderCSS: ordem CSS (style.order) para manter disposição visual
  const cardOrderCSS = Array.from(cards).map(c => Number(c.style.order) || 0);
  // matchedCards: índices das cartas marcadas como 'found'
  const matchedCards = Array.from(cards)
    .map((card, i) => card.classList.contains("found") ? i : null)
    .filter(i => i !== null);

  const gameState = {
    cardOrder,
    cardOrderCSS,
    matchedCards,
    attempts: attempts,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('memoryGameState', JSON.stringify(gameState));
  console.log('Jogo salvo.', gameState);
}

function loadGameState() {
  const savedState = localStorage.getItem('memoryGameState');
  if (!savedState) return null;
  try {
    return JSON.parse(savedState);
  } catch (e) {
    console.warn('Estado salvo corrompido, removendo.', e);
    localStorage.removeItem('memoryGameState');
    return null;
  }
}

function clearGameState() {
  localStorage.removeItem('memoryGameState');
  console.log('Estado do jogo limpo.');
}

function restoreGame(state) {
  console.log('Restaurando jogo salvo', state);

  // Proteções contra estados antigos/incompletos
  const cardOrder = Array.isArray(state.cardOrder) ? state.cardOrder : [];
  const cardOrderCSS = Array.isArray(state.cardOrderCSS)
    ? state.cardOrderCSS
    : cardOrder.map((_, i) => i); // fallback: ordem sequencial
  const matchedCards = Array.isArray(state.matchedCards) ? state.matchedCards : [];

  // Se não houver cardOrder válido, monta novo tabuleiro
  if (cardOrder.length === 0) {
    buildNewBoard();
    return;
  }

  board.innerHTML = "";
  cards = [];

  // Recria as cartas na ordem salva (ou padrão)
  cardOrder.forEach((value, i) => {
    const card = createCard(value);
    card.style.order = (cardOrderCSS[i] !== undefined) ? cardOrderCSS[i] : i;
    board.appendChild(card);
    cards.push(card);
  });

  // Marca cartas já encontradas: adiciona 'found' + 'flip' e remove listener
  matchedCards.forEach(index => {
    const c = cards[index];
    if (c) {
      c.classList.add('found', 'flip'); // garante que a face fique visível
      // remove event listener caso exista
      c.removeEventListener('click', flipCard);
    }
  });

  attempts = Number(state.attempts) || 0;
  attemptsSpan.textContent = attempts;
  matchedPairs = Math.floor((matchedCards.length || 0) / 2);

  // Garante estado interno consistente
  resetBoard();

  // Adiciona listeners apenas nas cartas que não foram encontradas
  bindCardListeners();

  console.log('Restauração concluída: attempts=', attempts, 'matchedPairs=', matchedPairs);
}


// ===================================================================
// INICIALIZAÇÃO: monta o tabuleiro (novo jogo) ou restaura se houver
// ===================================================================

function buildNewBoard() {
  board.innerHTML = "";
  cards = [];

  for (let i = 0; i < nCards; i++) {
    const newCard1 = createCard(i);
    const newCard2 = createCard(i);
    board.appendChild(newCard1);
    board.appendChild(newCard2);
    cards.push(newCard1);
    cards.push(newCard2);
  }

  shuffle();
  bindCardListeners();

  attempts = 0;
  matchedPairs = 0;
  attemptsSpan.textContent = attempts;
}

function initGame() {
  const saved = loadGameState();
  if (saved) {
    restoreGame(saved);
  } else {
    buildNewBoard();
  }
}


// Inicia
document.addEventListener('DOMContentLoaded', () => {
  attemptsSpan = document.getElementById('attempts');
  board = document.getElementById('board');
  initGame();
});
