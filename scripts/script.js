let btnPausa = document.getElementById('btnPausa');
let btnInicia = document.getElementById('btnInicia');
let ondaDiv = document.getElementById('animacaoOnda');
let actionText = document.getElementById('pomodoroActionStatus');
let timeDisplay = document.getElementById('time');
let horaSomaTotal = document.getElementById('horas');
let minutoSomaTotal = document.getElementById('minutos');
let textMode = document.getElementById('textMode');
let iconMode = document.getElementById('iconMode');

let timer;
let maxMinutes = 25;
let minutes = maxMinutes;
let maxSeconds = 0;
let seconds = maxSeconds;
timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

let listaExercicios = []
let exercicioAtual = 0
let offset = 0

function actionPomodoro(action){
    btnInicia.classList.toggle('active');
    btnPausa.classList.toggle('active');
    actionText.innerText = 'Pausar';
    if(action === 0){
        actionText.innerText = 'Iniciar';
    }
}

function sobeOnda(min, sec){
  let tempoTotal = ((min * 60 ) + sec);
  let alturaTotal = (tempoTotal / (maxMinutes * 60 + maxSeconds)) * 100;

  ondaDiv.setAttribute('style', 'transform:translateY('+alturaTotal+'%)');
}

function startTimer() {
  timer = setInterval(() => {
    if(seconds == 0) {
      if(minutes == 0) {
        clearInterval(timer);
        mostrarExercicio();
        maxMinutes = 5;
        maxSeconds = 0;
        minutes = maxMinutes;
        seconds = maxSeconds;
        timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
        textMode.innerText = "Descanso Curto";
        iconMode.setAttribute('src', './assets/descanso-curto.png');
        actionPomodoro(0);
        sobeOnda(minutes, seconds);
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }
    sobeOnda(minutes, seconds);
    timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

btnInicia.addEventListener('click', () => {
    startTimer();
});

btnPausa.addEventListener('click', () => {
    pauseTimer();
});

const loadUrl =  async () =>{
    const url = `https://api.api-ninjas.com/v1/exercises?type=stretching&offset=${offset}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {'X-Api-Key' : 'Your ApiKey'}
        });
        const data = await response.json();
        
        listaExercicios = data;
        console.log(listaExercicios);
    } catch (error) {
        alert('Erro ao carregar a lista de exercícios', error)
        console.log(error);
    }
}

loadUrl();

function mostrarExercicio() {
  const listaAlongAtual = document.getElementById('alongAtual');
  const divRolagemCustom = document.createElement('div');
  divRolagemCustom.classList.add('rolagemCustom');
  
  const cardAlong = document.createElement('div');
  cardAlong.classList.add('cardsAlong');
  divRolagemCustom.appendChild(cardAlong);
  const nomeAlong = document.createElement('h2');
  nomeAlong.innerText = listaExercicios[exercicioAtual].name;
  const pAlong = document.createElement('p');
  pAlong.innerText = listaExercicios[exercicioAtual].instructions;
  cardAlong.appendChild(nomeAlong);
  cardAlong.appendChild(pAlong);
  const botaoFinalizarAlong = document.createElement('a');
  botaoFinalizarAlong.id = "btnAlong";
  botaoFinalizarAlong.innerText = "Finalizar";

  botaoFinalizarAlong.addEventListener("click", () => {

  })

  cardAlong.appendChild(botaoFinalizarAlong);

  listaAlongAtual.appendChild(divRolagemCustom);
}