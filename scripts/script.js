let btnPausa = document.getElementById('btnPausa');
let btnInicia = document.getElementById('btnInicia');
let ondaDiv = document.getElementById('animacaoOnda');
let actionText = document.getElementById('pomodoroActionStatus');
let timeDisplay = document.getElementById('time');
let audio = document.querySelector('audio');
let timer;
let maxMinutes = 25;
let minutes = maxMinutes;
let maxSeconds = 0;
let seconds = maxSeconds;
timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

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
        audio.play();
        alert("Tempo esgotado!");
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
    const url = "https://api.api-ninjas.com/v1/exercises?type=stretching";
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {'X-Api-Key' : 'Your ApiKey'}
        });
        const data = await response.json();
        
        for(let i of data){
            console.log(i.instructions);
        }
    } catch (error) {
        alert('algo deu errado nos estados')
    }
}
