import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EmpresaPacienteFuncao } from "../Empresa_Paciente_Funcao/Empresa_Paciente_Funcao";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class EmpresaPacienteFuncaoService {
    //url = 'http://localhost/SistemaClinica/AplicacaoServidor/api/routes/Empresa_Paciente_Funcao';
    url:string;

    constructor(private http: HttpClient) {
        const host = localStorage.getItem("host");
        this.url = `http://${host}/api/routes/`;
    }

    listaDeEmpresaPacienteFuncao(): Observable<EmpresaPacienteFuncao[]> {
        return this.http.get<EmpresaPacienteFuncao[]>(this.url, {
            headers: {
                db_user: "servidorLabmed",
                db_password: "labmed2019"
            }
        });
    }
}
