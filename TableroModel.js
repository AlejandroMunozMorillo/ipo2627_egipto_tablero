export class TableroModel {

    constructor() {
        this.dimension = 4;
        this.tamano = "mediana";
        this.tema = "clasico";
        this.fichas = [];
        this.movimientos = 0;
        this.completado = false;
    }
    nuevaPartida(configuracion) {
        this.dimension =
            this.validarDimension(
                configuracion.dimension
            );
        this.tamano =
            configuracion.tamano;
        this.tema =
            configuracion.tema;
        this.movimientos = 0;
        this.completado = false;
        this.fichas =
            this.generarTablero();
        this.completado =
            this.comprobarVictoria();

        return this.obtenerEstado();
    }
    validarDimension(dimension) {
        const valor =
            Number.parseInt(
                dimension,
                10
            );
        if (
            Number.isNaN(valor) ||
            valor < 3
        ) {
            return 3;
        }
        return valor;
    }
    generarTablero() {
        const tiposPorFila =
            this.generarTiposPorFila();
        const fichas = [];
        tiposPorFila.forEach((tipo) => {
            for (
                let columna = 0;
                columna < this.dimension;
                columna++
            ) {
                fichas.push(tipo);
            }
        });
        do {

            this.barajar(fichas);
        } while (
            this.comprobarFichasCompletadas(
                fichas
            )
        );
        return fichas;
    }
    generarTiposPorFila() {

        const tipos = [0, 1, 2];
        for (
            let fila = 3;
            fila < this.dimension;
            fila++
        ) {
            const tipoAleatorio =
                Math.floor(
                    Math.random() * 3
                );
            tipos.push(tipoAleatorio);
        }
        this.barajar(tipos);

        return tipos;
    }
    barajar(elementos) {
        for (
            let i = elementos.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                elementos[i],
                elementos[j]
            ] = [
                elementos[j],
                elementos[i]
            ];
        }
    }
    intercambiar(origen, destino) {
        const indiceOrigen =
            Number(origen);
        const indiceDestino =
            Number(destino);
        if (
            indiceOrigen === indiceDestino ||
            this.completado
        ) {
            return false;
        }
        if (
            !this.indiceValido(indiceOrigen) ||
            !this.indiceValido(indiceDestino)
        ) {
            return false;
        }
        [
            this.fichas[indiceOrigen],
            this.fichas[indiceDestino]
        ] = [
            this.fichas[indiceDestino],
            this.fichas[indiceOrigen]
        ];
        this.movimientos++;
        this.completado =
            this.comprobarVictoria();

        return true;
    }
    indiceValido(indice) {
        return (
            Number.isInteger(indice) &&
            indice >= 0 &&
            indice < this.fichas.length
        );
    }
    comprobarVictoria() {
        return this.comprobarFichasCompletadas(
            this.fichas
        );
    }
    comprobarFichasCompletadas(fichas) {
        if (
            fichas.length !==
            this.dimension *
            this.dimension
        ) {
            return false;
        }
        for (
            let fila = 0;
            fila < this.dimension;
            fila++
        ) {
            const inicio =
                fila * this.dimension;
            const tipo =
                fichas[inicio];
            for (
                let columna = 1;
                columna < this.dimension;
                columna++
            ) {
                const indice =
                    inicio + columna;

                if (
                    fichas[indice] !== tipo
                ) {
                    return false;
                }
            }
        }
        return true;
    }
    obtenerEstado() {
        return {
            dimension:
                this.dimension,
            tamano:
                this.tamano,
            tema:
                this.tema,
            fichas:
                [...this.fichas],
            movimientos:
                this.movimientos,
            completado:
                this.completado
        };
    }
}