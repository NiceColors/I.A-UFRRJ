import { Direcao } from "./enums/direcao";
import { Mapa } from "./classes/mapa";
import { Robo } from "./classes/robo";
import { SituacaoBusca } from "./enums/situacao-busca";

export class App {
    public readonly elementRef: HTMLElement;
    public readonly LIMITE_DE_PASSOS = 200;
    public readonly LINHAS = 10;
    public readonly COLUNAS = 10;

    public readonly POS_L_ROBO = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_ROBO = Math.floor(Math.random() * this.COLUNAS);
    public readonly POS_L_META = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_META = Math.floor(Math.random() * this.COLUNAS);

    private mapa: Mapa;
    
    constructor() {
        this.elementRef = document.querySelector('#app');
        this.mapa = new Mapa(this.LINHAS, this.COLUNAS, this.elementRef);
    }

    public async run() {
        const robo = new Robo(this.POS_L_ROBO, this.POS_C_ROBO, Direcao.Cima, this.LIMITE_DE_PASSOS, this.mapa, this.elementRef);

        this.mapa.posicionarRobo(this.POS_L_ROBO, this.POS_C_ROBO);

        // TODO: VALIDAR POSICAO DA META (DEVE SER DIFERENTE DA POSICAO DO ROBO)
        this.mapa.posicionarMeta(this.POS_L_META, this.POS_C_META);

        // TODO: VALIDAR PORCENTAGEM DE OBSTACULOS (DEVE ESTAR ENTRE O INTERVALO DE 20 A 60%)
        this.mapa.posicionarObstaculos();

        const resultado: Promise<SituacaoBusca> = robo.buscaEmProfundidade();

        this.imprimeResultado(await resultado, robo);

    }

    private imprimeResultado(resultado: SituacaoBusca, robo: Robo) {
        alert(`RESULTADO
               \n  - SITUAÇÃO: ${resultado}
               \n  - QUANTIDADE DE PASSOS: ${robo.getQtdPassos()} PASSOS`
        );
    }
}