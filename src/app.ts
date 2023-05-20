import { Direcao } from "./enums/direcao";
import { Mapa } from "./classes/mapa";
import { Robo } from "./classes/robo";
import { SituacaoBusca } from "./enums/situacao-busca";

export class App {
    public readonly elementRef: HTMLElement;
    public readonly LIMITE_DE_PASSOS = 200;
    public readonly LINHAS = 20;
    public readonly COLUNAS = 20;

    public readonly POS_L_ROBO = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_ROBO = Math.floor(Math.random() * this.COLUNAS);
    public readonly POS_L_META = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_META = Math.floor(Math.random() * this.COLUNAS);

    private mapa: Mapa;

    constructor() {
        this.elementRef = document.querySelector('#app');
        this.mapa = new Mapa(this.LINHAS, this.COLUNAS, this.elementRef);
    }

    public async run(algoritmoDeBusca: string) {
        this.mapa = new Mapa(this.LINHAS, this.COLUNAS, this.elementRef);
        
        const robo = new Robo(this.POS_L_ROBO, this.POS_C_ROBO, Direcao.Esquerda, this.LIMITE_DE_PASSOS, this.mapa, this.elementRef);

        this.mapa.posicionarRobo(this.POS_L_ROBO, this.POS_C_ROBO);

        // TODO: VALIDAR POSICAO DA META (DEVE SER DIFERENTE DA POSICAO DO ROBO)
        this.mapa.posicionarMeta(this.POS_L_META, this.POS_C_META);
        

        robo.posicionarElementoRobo();
        this.mapa.posicionarObstaculos();

        switch (algoritmoDeBusca) {
            case 'Busca em Profundidade':
                this.imprimeResultado(await robo.buscaEmProfundidade(), robo);
                break;

            case 'Busca Estrela':
                this.imprimeResultado(await robo.buscaEstrela(), robo);
                break;
        }
    }

    private imprimeResultado(resultado: SituacaoBusca, robo: Robo) {
        const modal = document.getElementById("modal");
        const modalContent = document.querySelector(".modal-content");

        const custoHtml = document.querySelector('#custo');
        const passosHtml = document.querySelector('#passos');

        custoHtml.innerHTML = robo.getQtdPassos().toString();

        modal.classList.add("show");
        modalContent.classList.add("show");
    }


}