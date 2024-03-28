let btnPausa = document.getElementById('btnPausa');
let btnInicia = document.getElementById('btnInicia');
let ondaDiv = document.getElementById('animacaoOnda');
let actionText = document.getElementById('pomodoroActionStatus');
let timeDisplay = document.getElementById('time');
let audio = document.querySelector('audio');
let horaSomaTotal = document.getElementById('horas');
let minutoSomaTotal = document.getElementById('minutos');
let textMode = document.getElementById('textMode');
let iconMode = document.getElementById('iconMode');

let timer;
let maxMinutes = 0;
let minutes = maxMinutes;
let maxSeconds = 2;
let seconds = maxSeconds;
timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
let countTimer = 0;
let listaExercicios = []
let exercicioAtual = 0
let offset = 0

function mudaLimiteTimer(){
  countTimer += 1;
  console.log(countTimer);
  if(countTimer == 9){
    mudaTotalHoras();
    countTimer = -1;
    maxMinutes = 15;
    maxSeconds = 0;
    minutes = maxMinutes;
    seconds = maxSeconds;
    timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    textMode.innerText = "Descanso Longo";
    iconMode.setAttribute('src', './assets/descanso-longo.png');
    mostrarExercicio();
    actionPomodoro(0);
    sobeOnda(minutes, seconds);
    return;
  }
  if(countTimer % 2 != 0){
    mudaTotalHoras();
    maxMinutes = 5;
    maxSeconds = 0;
    minutes = maxMinutes;
    seconds = maxSeconds;
    timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    textMode.innerText = "Descanso Curto";
    iconMode.setAttribute('src', './assets/descanso-curto.png');
    mostrarExercicio();
    actionPomodoro(0);
    sobeOnda(minutes, seconds);
    return;
  }
  if(countTimer % 2 == 0){
    maxMinutes = 25;
    maxSeconds = 0;
    minutes = maxMinutes
    seconds = maxSeconds;
    timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    textMode.innerText = "Modo de Trabalho";
    iconMode.setAttribute('src', './assets/modo-trabalho.png');
    actionPomodoro(0);
    sobeOnda(minutes, seconds);
    return;
  } 
}


function actionPomodoro(action) {
  btnInicia.classList.toggle('active');
  btnPausa.classList.toggle('active');
  actionText.innerText = 'Pausar';
  if (action === 0) {
    actionText.innerText = 'Iniciar';
  }
}

function sobeOnda(min, sec) {
  let tempoTotal = ((min * 60) + sec);
  let alturaTotal = (tempoTotal / (maxMinutes * 60 + maxSeconds)) * 100;

  ondaDiv.setAttribute('style', 'transform:translateY(' + alturaTotal + '%)');
}

function startTimer() {
  timer = setInterval(() => {
    if (seconds == 0) {
      if (minutes == 0) {
        clearInterval(timer);
        // audio.play();
        // alert("Tempo esgotado!");
        mudaLimiteTimer();
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

const loadUrl = async () => {
  const url = `https://api.api-ninjas.com/v1/exercises?type=stretching&offset=${offset}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": "your API key" },
    });
    const data = await response.json();

    listaExercicios = data;
    console.log(listaExercicios);
  } catch (error) {
    alert('Erro ao carregar a lista de exercícios', error)
    console.log(error);
  }
}



function mostrarExercicio() {
  
  const listaAlongAtual = document.getElementById('alongAtual');
  const divRolagemCustom = document.createElement('div');
  divRolagemCustom.classList.add('rolagemCustom');

  const cardAlong = document.createElement('div');
  cardAlong.classList.add('cardsAlong');
  divRolagemCustom.appendChild(cardAlong);
  let nomeAlong = document.createElement('h2');
  nomeAlong.innerText = listaExercicios[exercicioAtual].name;
  let pAlong = document.createElement('p');
  pAlong.innerText = listaExercicios[exercicioAtual].instructions;
  cardAlong.appendChild(nomeAlong);
  cardAlong.appendChild(pAlong);
  const botaoFinalizarAlong = document.createElement('a');
  botaoFinalizarAlong.id = "btnAlong";
  botaoFinalizarAlong.innerText = "Finalizar";



  botaoFinalizarAlong.addEventListener("click", () => {
    mostrarExercicioConcluido();
    divRolagemCustom.removeChild(cardAlong);//
    listaAlongAtual.removeChild(divRolagemCustom); //remove exercicio atual
    if (exercicioAtual === 9) {
      offset = offset + 10;
      exercicioAtual = 0;
      localStorage.setItem("pagina", offset);
      loadUrl();
      return;
    }

    exercicioAtual++;
    console.log(exercicioAtual)
  })

  cardAlong.appendChild(botaoFinalizarAlong);

  listaAlongAtual.appendChild(divRolagemCustom);



  // MATHEUS LOCAL STORAGE EXERCICIO 5

  let arrayExercicioConcluido = [];

  function mostrarExercicioConcluido() {

    if (localStorage.ExerciciosConcluidos) {
      arrayExercicioConcluido = JSON.parse(localStorage.getItem('ExerciciosConcluidos'));
    } //verifica se existe o array 'ExerciciosConcluidos' dentro do localStorage para não sobrescrever os itens anteriores.

    let novoItemExercicioConcluido = nomeAlong.textContent; //coletando o nome do exercico atual apos apertar botão FINALIZAR.
    arrayExercicioConcluido.push(novoItemExercicioConcluido);//inserindo um novo dado dentro do array 'arrayExercicioConcluido'.


    // armazenando no localStorage
    localStorage.ExerciciosConcluidos = JSON.stringify(arrayExercicioConcluido);

    // // insere no HTML os exercicios realizados
    let resultCLASS = document.querySelector('.rolagemCustom');//acessa a classe
    resultCLASS.innerHTML = "";//limpando a classe antes de adicionar outro item.
    if (localStorage.ExerciciosRealizados) {
      arrayExercicioConcluido = JSON.parse(localStorage.getItem('ExerciciosConcluidos'));
    }

    //percorrendo todas as posições do array, para cada execução ira criar um novo item da lista
    for (let i in arrayExercicioConcluido) {
      let listItem = document.createElement('li');
      listItem.innerHTML = arrayExercicioConcluido[i];
      resultCLASS.appendChild(listItem);


    }
  }
}

/* pegar exercicios e paginação do locaStorage,mostra na tela os itens ja armazenados 
e ja começa a busca de exercicio na pagina salva */
function getStoraged() {
  const exerciciosArmazenados = JSON.parse(localStorage.getItem("ExerciciosConcluidos"));
  if(exerciciosArmazenados) {
    let resultCLASS = document.querySelector('.rolagemCustom');
    resultCLASS.innerHTML = "";
    for (let i in exerciciosArmazenados) {
      let listItem = document.createElement('li');
      listItem.innerHTML = exerciciosArmazenados[i];
      resultCLASS.appendChild(listItem);


    }
  }
  const paginaArmazenado = localStorage.getItem("pagina");
  if(paginaArmazenado) {
    console.log(paginaArmazenado);
    offset = paginaArmazenado;
  }
  loadUrl();

}
getStoraged();


let minutosPassados = 0;
let horasPassadas = 0;

function mudaTotalHoras(){
  const horas = document.getElementById('horas');
  const minutos = document.getElementById('minutos');
  minutosPassados += maxMinutes;
  if(minutosPassados >= 60){
    horasPassadas += 1;
    minutosPassados = minutosPassados - 60;
  }
  horas.innerText = horasPassadas;
  minutos.innerText = minutosPassados;
}