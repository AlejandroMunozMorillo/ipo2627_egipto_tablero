export class TableroView {

    constructor() {
        this.tablero =
            document.getElementById("tablero");
        this.dimension =
            document.getElementById("dimension");
        this.tamano =
            document.getElementById("tamano");
        this.tema =
            document.getElementById("tema");
        this.botonNueva =
            document.getElementById("nueva-partida");
        this.movimientos =
            document.getElementById("movimientos");
        this.estado =
            document.getElementById("estado");
        this.botonAyuda =
            document.getElementById("boton-ayuda");
        this.panelAyuda =
            document.getElementById("panel-ayuda");
        this.manejadorMovimiento = null;
    }
    obtenerConfiguracion() {
        return {
            dimension: this.dimension.value,
            tamano: this.tamano.value,
            tema: this.tema.value
        };
    }
    sincronizarConfiguracion(estado) {
        this.dimension.value =
            estado.dimension;
        this.tamano.value =
            estado.tamano;
        this.tema.value =
            estado.tema;
    }
    renderizar(estado) {
        this.sincronizarConfiguracion(estado);
        this.renderizarTablero(estado);
        this.actualizarInformacion(estado);
    }
    renderizarTablero(estado) {
        this.tablero.replaceChildren();
        this.tablero.style.setProperty(
            "--dimension",
            estado.dimension
        );
        this.tablero.dataset.tamano =
            estado.tamano;
        this.tablero.dataset.tema =
            estado.tema;
        this.tablero.dataset.completado =
            estado.completado;
        this.tablero.setAttribute(
            "aria-label",
            `Tablero ${estado.dimension} por ${estado.dimension}`
        );
        estado.fichas.forEach(
            (tipo, indice) => {
                const celda =
                    document.createElement("div");
                celda.classList.add(
                    "tablero__celda"
                );
                celda.dataset.cellIndex =
                    indice;
                celda.setAttribute(
                    "role",
                    "gridcell"
                );
                const ficha =
                    document.createElement("div");
                ficha.classList.add(
                    "ficha"
                );
                ficha.dataset.pieceIndex =
                    indice;
                ficha.dataset.type =
                    tipo;
                ficha.draggable =
                    !estado.completado;
                ficha.setAttribute(
                    "role",
                    "img"
                );
                ficha.setAttribute(
                    "aria-label",
                    `Ficha tipo ${tipo + 1}`
                );
                celda.append(ficha);
                this.tablero.append(celda);
            }
        );
        if (!estado.completado) {
            this.activarDragDrop();
        }
    }
    actualizarInformacion(estado) {
        this.movimientos.textContent =
            estado.movimientos;
        this.estado.classList.remove(
            "juego__estado--victoria"
        );
        if (estado.completado) {
            this.estado.textContent =
                `¡Tablero completado en ${estado.movimientos} movimientos!`;
            this.estado.classList.add(
                "juego__estado--victoria"
            );
        } else {
            this.estado.textContent =
                "Partida en curso";
        }
    }
    enlazarMovimiento(manejador) {
        this.manejadorMovimiento =
            manejador;
    }

    activarDragDrop() {
        const fichas =
            this.tablero.querySelectorAll(
                "[data-piece-index]"
            );
        const celdas =
            this.tablero.querySelectorAll(
                "[data-cell-index]"
            );
        fichas.forEach((ficha) => {
            ficha.addEventListener(
                "dragstart",
                (evento) =>
                    this.comenzarArrastre(evento)
            );
            ficha.addEventListener(
                "dragend",
                () =>
                    this.terminarArrastre()
            );
        });
        celdas.forEach((celda) => {
            celda.addEventListener(
                "dragenter",
                (evento) =>
                    this.entradaDestino(evento)
            );
            celda.addEventListener(
                "dragover",
                (evento) =>
                    this.sobreDestino(evento)
            );
            celda.addEventListener(
                "dragleave",
                (evento) =>
                    this.salidaDestino(evento)
            );
            celda.addEventListener(
                "drop",
                (evento) =>
                    this.soltarFicha(evento)
            );
        });
    }
    comenzarArrastre(evento) {
        const ficha =
            evento.currentTarget;
        const indice =
            ficha.dataset.pieceIndex;
        evento.dataTransfer.setData(
            "text/plain",
            indice
        );
        evento.dataTransfer.effectAllowed =
            "move";
        ficha.classList.add(
            "ficha--arrastrando"
        );
    }
    sobreDestino(evento) {
        evento.preventDefault();
        evento.dataTransfer.dropEffect =
            "move";
    }
    entradaDestino(evento) {
        evento.preventDefault();
        evento.currentTarget.classList.add(
            "tablero__celda--destino"
        );
    }
    salidaDestino(evento) {
        const celda =
            evento.currentTarget;
        if (
            !celda.contains(
                evento.relatedTarget
            )
        ) {
            celda.classList.remove(
                "tablero__celda--destino"
            );
        }
    }
    soltarFicha(evento) {
        evento.preventDefault();
        const celdaDestino =
            evento.currentTarget;
        celdaDestino.classList.remove(
            "tablero__celda--destino"
        );
        const origen =
            evento.dataTransfer.getData(
                "text/plain"
            );
        const destino =
            celdaDestino.dataset.cellIndex;
        if (this.manejadorMovimiento) {
            this.manejadorMovimiento(
                origen,
                destino
            );
        }
    }
    terminarArrastre() {
        const fichas =
            this.tablero.querySelectorAll(
                "[data-piece-index]"
            );
        const celdas =
            this.tablero.querySelectorAll(
                "[data-cell-index]"
            );
        fichas.forEach((ficha) => {
            ficha.classList.remove(
                "ficha--arrastrando"
            );
        });
        celdas.forEach((celda) => {
            celda.classList.remove(
                "tablero__celda--destino"
            );
        });
    }
    enlazarNuevaPartida(manejador) {
        this.botonNueva.addEventListener(
            "click",
            manejador
        );
    }
    enlazarConfiguracion(manejador) {
        const controles = [
            this.dimension,
            this.tamano,
            this.tema
        ];
        controles.forEach((control) => {
            control.addEventListener(
                "change",
                manejador
            );
        });
    }
    enlazarAyuda() {
        this.botonAyuda.addEventListener(
            "click",
            () =>
                this.alternarAyuda()
        );
        document.addEventListener(
            "keydown",
            (evento) => {
                if (
                    evento.key === "Escape"
                ) {
                    this.cerrarAyuda();
                }
            }
        );
        document.addEventListener(
            "click",
            (evento) => {
                const contenedor =
                    this.botonAyuda.closest(
                        ".ayuda"
                    );
                if (
                    !contenedor.contains(
                        evento.target
                    )
                ) {
                    this.cerrarAyuda();
                }
            }
        );
    }
    alternarAyuda() {
        const abierto =
            !this.panelAyuda.hidden;
        this.panelAyuda.hidden =
            abierto;
        this.botonAyuda.setAttribute(
            "aria-expanded",
            String(!abierto)
        );
    }

    cerrarAyuda() {
        this.panelAyuda.hidden = true;

        this.botonAyuda.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}