import { EstadoCelula } from "../enums/estado-celula";
import { SituacaoCelula } from "../enums/situacao-celula";

export class Celula {
    public filhos: Array<Celula> = [];
    public situacao = SituacaoCelula.AguardandoVisita;
    public estado: EstadoCelula = EstadoCelula.Vazia;
    
    constructor(
        public readonly linha: number,
        public readonly coluna: number,
        public readonly pai: Celula | null = null
    ) {}

    private recebeuVisita() {
        return this.situacao === SituacaoCelula.Visitado || this.situacao === SituacaoCelula.Fechado;
    }

    private verificaSeDeveFechar() {
        return this.filhos.every(filho => filho.recebeuVisita());
    }
        
    public receberVisita() {
        if (this.verificaSeDeveFechar()) {
            this.situacao = SituacaoCelula.Fechado;
        } else {
            this.situacao = SituacaoCelula.Visitado;
        }
    }

    public atribuirFilho(filho: Celula) {
        this.filhos.push(filho);
    }
}