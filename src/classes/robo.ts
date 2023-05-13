import { Direcao } from "../enums/direcao";
import { EstadoCelula } from "../enums/estado-celula";
import { Mapa } from './mapa'
import { SituacaoBusca } from "../enums/situacao-busca";

export class Robo {
    private qtdPassos = 0;
    private locaisParaVisitar: Array<Array<number>> = new Array();
    private trajeto: Array<Array<number>> = new Array();

    constructor(
        private posL: number,
        private posC: number,
        private direcao: Direcao,
        private limiteDePassos: number,
        private mapa: Mapa
    ) { }

    public getQtdPassos() {
        return this.qtdPassos;
    }

    public async buscaEmProfundidade(): Promise<SituacaoBusca> {
        this.locaisParaVisitar.push([this.posL, this.posC]);

        while (this.locaisParaVisitar.length > 0 && this.qtdPassos < this.limiteDePassos) {

            const [novaPosX, novaPosY] = this.locaisParaVisitar.pop();
            this.movimentar(novaPosX, novaPosY);
            this.trajeto.push([this.posL, this.posC]);

            const vizinhos = this.mapa.consultaVizinhos(celula);
            for (let i = 0; i < vizinhos.length; i++) {
                const vizinho = vizinhos[i];
                const localExplorado = this.trajeto.some((v) => {
                    return v[0] === vizinho.linha && v[1] === vizinho.coluna;
                });

                const localJaSeraVisitado = this.locaisParaVisitar.some((v) => {
                    return v.linha === vizinho.linha && v.coluna === vizinho.coluna;
                });

                if (localExplorado || localJaSeraVisitado) {
                    vizinhos.splice(i, 1);
                    i--;
                }
            }

            if (vizinhos.length === 0) {
                let celulaTemporaria = celula.pai;
                while (celulaTemporaria !== null) {
                    await this.movimentar(celulaTemporaria);

                    if (!celulaTemporaria.fechado) {
                        break;
            }

                    celulaTemporaria = celulaTemporaria.pai;
                }
            } else {
                for (const vizinho of vizinhos) {
                    this.locaisParaVisitar.push(vizinho);
                    celula.atribuirFilho(vizinho);
                }
            }
        }

        return (this.qtdPassos === this.limiteDePassos) ? SituacaoBusca.LimiteDePassosExcedido : SituacaoBusca.MetaNaoEncontrada;
    }

    private async movimentar(celula: Celula) {
        this.qtdPassos++;
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia);
        this.posL = celula.linha;
        this.posC = celula.coluna;
        this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo);
        celula.receberVisita();

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
