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
let maxMinutes = 25;
let minutes = maxMinutes;
let maxSeconds = 0;
let seconds = maxSeconds;
timeDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
let countTimer = 0;
let listaExercicios = []
let exercicioAtual = 0
let offset = 0

function mudaLimiteTimer(){
  countTimer += 1;
  console.log(countTimer);
  if(countTimer == 7){
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
        audio.play();
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
      headers: { "X-Api-Key": "Your API key" },
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

  // Verifica se o exercício atual já foi concluído
  let exercicioConcluido = isExercicioConcluido(listaExercicios[exercicioAtual].name);

  //Se o exercício não foi concluído, cria os elementos HTML para exibir o nome e as instruções do exercício,
  //bem como um botão para marcar o exercício como concluído 
  if (!exercicioConcluido) {
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
      divRolagemCustom.removeChild(cardAlong);
      listaAlongAtual.removeChild(divRolagemCustom);
      // Incrementa o índice do exercício atual
      exercicioAtual++;

      // Verifica se atingiu o final da lista de exercícios
      if (exercicioAtual === listaExercicios.length) {
        offset = offset + 10;
        exercicioAtual = 0;
        localStorage.setItem("pagina", offset);
        loadUrl();
      } else {
        // Armazena o índice do último exercício concluído no localStorage
        localStorage.setItem("ultimoIndiceConcluido", exercicioAtual);
      }
    });

    cardAlong.appendChild(botaoFinalizarAlong);
    listaAlongAtual.appendChild(divRolagemCustom);
  } else {
    // Se o exercício já foi concluído, avança para o próximo exercício
    exercicioAtual++;
    if (exercicioAtual === listaExercicios.length) {
      offset = offset + 10;
      exercicioAtual = 0;
      localStorage.setItem("pagina", offset);
      loadUrl();
    }
    mostrarExercicio(); // Chama recursivamente para exibir o próximo exercício disponível
  }
}


//Esta função recebe o nome de um exercício como parâmetro e verifica se esse exercício está presente 
//na lista de exercícios concluídos armazenados no localStorage
function isExercicioConcluido(nomeExercicio) {
  // verifica se o nome do exercício está presente na lista de exercícios concluídos e retorna
  // verdadeiro se estiver, indicando que o exercício foi concluído anteriormente, e falso caso contrário
  if (localStorage.ExerciciosConcluidos) {
    //se a lista de exercícios concluídos existir no localStorage, ela é recuperada e convertida de volta para um array usando JSON.parse().
    let arrayExercicioConcluido = JSON.parse(localStorage.getItem('ExerciciosConcluidos'));
    //Em seguida, a função verifica se o nome do exercício está presente nesse array usando o método includes(). Se estiver presente, significa 
    //que o exercício foi concluído anteriormente, e a função retorna true; caso contrário, retorna false.
    return arrayExercicioConcluido.includes(nomeExercicio);
  }
  return false;
}


function mostrarExercicioConcluido() {
  let arrayExercicioConcluido = [];

  // Verifica se há algum exercício concluído armazenado no localStorage
  if (localStorage.ExerciciosConcluidos) {
    arrayExercicioConcluido = JSON.parse(localStorage.getItem('ExerciciosConcluidos'));
  }

  let novoItemExercicioConcluido = listaExercicios[exercicioAtual].name;

  // Verifica se o novo item já está presente no array
  if (!arrayExercicioConcluido.includes(novoItemExercicioConcluido)) {
    arrayExercicioConcluido.push(novoItemExercicioConcluido);

    // Armazena o array atualizado de exercícios concluídos no localStorage
    localStorage.ExerciciosConcluidos = JSON.stringify(arrayExercicioConcluido);

    let resultCLASS = document.querySelector('.rolagemCustom');
    resultCLASS.innerHTML = "";

    // Atualiza a lista de exercícios concluídos exibida no HTML
    for (let i = 0; i < arrayExercicioConcluido.length; i++) {
      let listItem = document.createElement('li');
      listItem.innerHTML = arrayExercicioConcluido[i];
      resultCLASS.appendChild(listItem);
    }
  }
}

function getStoraged() {
  const exerciciosArmazenados = JSON.parse(localStorage.getItem("ExerciciosConcluidos"));
  if (exerciciosArmazenados) {
    let resultCLASS = document.querySelector('.rolagemCustom');
    resultCLASS.innerHTML = "";
    for (let i in exerciciosArmazenados) {
      let listItem = document.createElement('li');
      listItem.innerHTML = exerciciosArmazenados[i];
      resultCLASS.appendChild(listItem);
    }
  }
  const paginaArmazenado = localStorage.getItem("pagina");
  if (paginaArmazenado) {
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
