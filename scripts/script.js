let btnPausa = document.getElementById('btnPausa');
let btnInicia = document.getElementById('btnInicia');
let actionText = document.getElementById('pomodoroActionStatus');
let timeDisplay = document.getElementById('time');
let timer;
let minutes = 25;
let seconds = 0;
timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

function actionPomodoro(action){
    btnInicia.classList.toggle('active');
    btnPausa.classList.toggle('active');
    actionText.innerText = 'Pausar';
    if(action === 0){
        actionText.innerText = 'Iniciar';
    }
}


function startTimer() {
  timer = setInterval(() => {
    if(seconds == 0) {
      if(minutes == 0) {
        clearInterval(timer);
        alert("Tempo esgotado!");
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }
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
            headers: {'X-Api-Key' : '8Tos1ttCs+SWR7VVd1lcow==ANHIvSP8R5OEZQCx'}
        });
        const data = await response.json();
        
        for(let i of data){
            console.log(i.instructions);
        }
    } catch (error) {
        alert('algo deu errado nos estados')
    }
}
