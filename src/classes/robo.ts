import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { SituacaoBusca } from "../enums/situacao-busca";
import { Mapa } from './mapa'

export class Robo {
    private locaisParaVisitar: Array<Array<number>> = new Array();
    private qtdPassos = 0;

    constructor(
        private posL: number,
        private posC: number,
        private direcao: Direcao,
        private limiteDePassos: number,
        private mapa: Mapa
    ) {}

    private trajeto: Array<Array<number>> = new Array();

    public search() {
        this.locaisParaVisitar.push([this.posL, this.posC]);

        while (this.locaisParaVisitar.length > 0 && this.qtdPassos < this.limiteDePassos) {
            const [novaPosX, novaPosY] = this.locaisParaVisitar.pop();
            this.movimentar(novaPosX, novaPosY);

            const vizinhos = this.mapa.consultaVizinhos(this.posL, this.posC);
            for (const vizinho of vizinhos) {
                const localExplorado = this.trajeto.some((v) => {
                    return v[0] === vizinho[0] && v[1] === vizinho[1];
                });

                if (!localExplorado) {
                    this.locaisParaVisitar.push(vizinho);
                }
            }

            this.qtdPassos++;

            console.log('\nFRAME %d', this.qtdPassos);
            this.mapa.imprimir();
            console.log('--------------');

            if (this.mapa.metaEncontrada(this.posL, this.posC)) {
                return SituacaoBusca.MetaEncontrada;
            }
        }

        return (this.qtdPassos === this.limiteDePassos) ? SituacaoBusca.LimiteDePassosExcedido : SituacaoBusca.MetaNaoEncontrada;
    }

    private movimentar(posL: number, posC: number) {
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia);

        this.posL = posL;
        this.posC = posC;

        this.trajeto.push([this.posL, this.posC]);
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo);
    }
}
