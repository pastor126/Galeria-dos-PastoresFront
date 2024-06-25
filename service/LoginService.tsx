import axios from "axios";
import { Password } from "primereact/password";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class LoginService{

    novoCadastro(usuario: Galeria.Usuario){
        return axiosInstance.post("/auth/novoUsuario", usuario);
    }
    login(login: String, senha: String){
        return axiosInstance.post("/auth/login", {username: login, password: senha})
    }

}