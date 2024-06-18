import axios from "axios";
import { GeralService } from "./GeralService";



export class PermissaoPerfilRecursoService extends GeralService{

    constructor(){
        super("/permissao-perfil-recurso");
    }

}