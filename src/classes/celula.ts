import { EstadoCelula } from "../enums/estado-celula";

export class Celula {
    public filhos: Array<Celula> = [];
    public visitado = false;
    public fechado = false;
    public estado: EstadoCelula = EstadoCelula.Vazia;
    
    constructor(
        public readonly linha: number,
        public readonly coluna: number,
        public readonly pai: Celula | null = null
    ) {}

    public receberVisita() {
        this.visitado = true;
        this.fechado = this.filhos.every(filho => filho.visitado);
    }

    public atribuirFilho(filho: Celula) {
        this.filhos.push(filho);
    }
}