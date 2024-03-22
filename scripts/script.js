let btnPausa = document.getElementById('btnPausa');
let btnInicia = document.getElementById('btnInicia');
let actionText = document.getElementById('pomodoroActionStatus');

function actionPomodoro(action){
    btnInicia.classList.toggle('active');
    btnPausa.classList.toggle('active');
    actionText.innerText = 'Pausar';
    if(action === 0){
        actionText.innerText = 'Iniciar';
    }
}



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
