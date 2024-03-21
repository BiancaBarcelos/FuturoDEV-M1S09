//Lucas



//Victor
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


//Matheus



//