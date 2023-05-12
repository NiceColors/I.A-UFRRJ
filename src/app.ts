
import { Mapa } from "./classes/mapa";
import { Robo } from "./classes/robo";
import { Direcao } from "./enums/direcao";

export class App {
    public readonly LIMITE_DE_PASSOS = 30;
    public readonly LINHAS = 5;
    public readonly COLUNAS = 5;
    
    public run() {
        const mapa = new Mapa(this.LINHAS, this.COLUNAS);
        const robo = new Robo(0, 0, Direcao.Baixo, 0, mapa);
        robo.search();
    }
}