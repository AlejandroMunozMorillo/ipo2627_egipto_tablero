export class TableroController {

    constructor(modelo, vista) {
        this.modelo =
            modelo;
        this.vista =
            vista;
    }
    iniciar() {
        this.vista.enlazarMovimiento(
            (origen, destino) =>
                this.realizarMovimiento(
                    origen,
                    destino
                )
        );
        this.vista.enlazarNuevaPartida(
            () =>
                this.nuevaPartida()
        );
        this.vista.enlazarConfiguracion(
            () =>
                this.nuevaPartida()
        );
        this.vista.enlazarAyuda();
        this.nuevaPartida();
    }
    nuevaPartida() {
        const configuracion =
            this.vista.obtenerConfiguracion();
        const estado =
            this.modelo.nuevaPartida(
                configuracion
            );
        this.vista.renderizar(
            estado
        );
    }
    realizarMovimiento(
        origen,
        destino
    ) {
        const realizado =
            this.modelo.intercambiar(
                origen,
                destino
            );
        if (!realizado) {
            return;
        }
        const estado =
            this.modelo.obtenerEstado();
        this.vista.renderizar(
            estado
        );
    }
}