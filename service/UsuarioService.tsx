import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8089"
})

export class UsuarioService{
    listarTodos(){
        return axiosInstance.get("/usuario")
    }
}