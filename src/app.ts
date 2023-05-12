
import { Mapa } from "./classes/mapa";
import { Robo } from "./classes/robo";
import { Direcao } from "./enums/direcao";
import { SituacaoBusca } from "./enums/situacao-busca";

export class App {
    public readonly LIMITE_DE_PASSOS = 30;
    public readonly LINHAS = 10;
    public readonly COLUNAS = 10;

    public readonly POS_L_ROBO = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_ROBO = Math.floor(Math.random() * this.COLUNAS);

    public readonly POS_L_META = Math.floor(Math.random() * this.LINHAS);
    public readonly POS_C_META = Math.floor(Math.random() * this.COLUNAS);

    public run() {
        const mapa = new Mapa(this.LINHAS, this.COLUNAS);
        const robo = new Robo(this.POS_L_ROBO, this.POS_C_ROBO, Direcao.Baixo, this.LIMITE_DE_PASSOS, mapa);
        
        mapa.posicionarRobo(this.POS_L_ROBO, this.POS_C_ROBO);

        // TODO: VALIDAR POSICAO DA META (DEVE SER DIFERENTE DA POSICAO DO ROBO)
        mapa.posicionarMeta(this.POS_L_META, this.POS_C_META);
        
        // TODO: VALIDAR PORCENTAGEM DE OBSTACULOS (DEVE ESTAR ENTRE O INTERVALO DE 20 A 60%)
        mapa.posicionarObstaculos();

        const tempoInicial = performance.now();
        const resultado: SituacaoBusca = robo.search();
        const tempoFinal = performance.now();

        this.imprimeResultado(resultado, robo, tempoFinal - tempoInicial);
    }

    private imprimeResultado(resultado: SituacaoBusca, robo: Robo, tempoDeBusca: number) {
        console.log('\n\n:::::::::::::::: RESULTADO ::::::::::::::::');
        console.log('  - SITUAÇÃO: %s ', resultado);
        console.log('  - QUANTIDADE DE PASSOS: %d PASSOS ', robo.getQtdPassos());
        console.log('  - TEMPO DE BUSCA: %fms ', tempoDeBusca);
    }
}