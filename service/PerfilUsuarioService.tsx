import axios from "axios";
import { GeralService } from "./GeralService";



export class PerfilUsuarioService extends GeralService{

    constructor(){
        super("/perfil-usuario");
    }

}