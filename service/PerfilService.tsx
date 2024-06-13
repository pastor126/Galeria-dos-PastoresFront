import axios from "axios";
import { GeralService } from "./GeralService";



export class PerfilService extends GeralService{

    constructor(){
        super("/perfil");
    }

}