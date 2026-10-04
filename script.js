import {
    TableroModel
} from "./TableroModel.js";
import {
    TableroView
} from "./TableroView.js";
import {
    TableroController
} from "./TableroController.js";

const modelo =
    new TableroModel();

const vista =
    new TableroView();

const controlador =
    new TableroController(
        modelo,
        vista
    );

controlador.iniciar();