import axios from "axios";
import { GeralService } from "./GeralService";



export class UsuarioService extends GeralService{

    constructor(){
        super("/usuario");
    }

}