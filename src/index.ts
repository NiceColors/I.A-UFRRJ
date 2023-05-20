import { App } from "./app";

const app = new App();

const comecar = document.querySelector('#comecar');
const algoritmoDeBusca = document.querySelector('#algoritmo-de-busca') as HTMLSelectElement;

comecar.addEventListener('click', () => {

    // parar o run anterior caso exista
    

    app.run(algoritmoDeBusca.value);
});


algoritmoDeBusca.addEventListener('change', () => {
    const custoHtml = document.querySelector('#custo');
    const passosHtml = document.querySelector('#passos');
    const tempoHtml = document.querySelector('#tempo');

    custoHtml.innerHTML = '';
    passosHtml.innerHTML = '';
    tempoHtml.innerHTML = '';
});

