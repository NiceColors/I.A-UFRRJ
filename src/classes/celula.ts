import { EstadoCelula } from "../enums/estado-celula";
import { SituacaoCelula } from "../enums/situacao-celula";

export class Celula {
    public ramos: Array<Celula> = [];
    public situacao = SituacaoCelula.AguardandoVisita;
    public estado: EstadoCelula = EstadoCelula.Vazia;

    public custoG = 0; // custo acumulado desde o inicio até a célula
    public custoH = 0; // custo do nó até até a meta
    public custoF = 0; // custo total 

    constructor(
        public readonly linha: number,
        public readonly coluna: number,
        public raiz: Celula | null = null
    ) { }

    public recebeuVisita() {
        return this.situacao === SituacaoCelula.Visitado || this.situacao === SituacaoCelula.Fechado;
    }

    private verificaSeDeveFechar() {
        return this.ramos.every(ramo => ramo.recebeuVisita());
    }

    public receberVisita() {
        if (this.verificaSeDeveFechar()) {
            this.situacao = SituacaoCelula.Fechado;
        } else {
            this.situacao = SituacaoCelula.Visitado;
        }
    }

    public atribuirRamo(ramo: Celula) {
        this.ramos.push(ramo);
    }
}
