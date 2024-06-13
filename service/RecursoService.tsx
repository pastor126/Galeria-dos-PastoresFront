import axios from "axios";
import { GeralService } from "./GeralService";



export class RecursoService extends GeralService{

    constructor(){
        super("/recurso");
    }

}