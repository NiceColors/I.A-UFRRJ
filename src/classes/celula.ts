import { EstadoCelula } from "../enums/estado-celula";
import { SituacaoCelula } from "../enums/situacao-celula";

export class Celula {
    public ramos: Array<Celula> = [];
    public situacao = SituacaoCelula.AguardandoVisita;
    public estado: EstadoCelula = EstadoCelula.Vazia;

    constructor(
        public readonly linha: number,
        public readonly coluna: number,
        public readonly raiz: Celula | null = null,
        public custo = 0
    ) { }

    private recebeuVisita() {
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