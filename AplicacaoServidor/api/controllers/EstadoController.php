<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: X-Requested-With,content-type");
    header("Access-Control-Allow-Methods:GET,POST");          
    header("Access-Control-Request-Method:POST");
    header("Content-type: application/json");

    include_once("../../models/Estado.php");

    function executarAcao($acao, $requestHeaders, $requestBody){
        switch($acao) {
            case "INDEX":
                $estado = new Estado();
                $estado->setDBUsuario($requestHeaders["db_user"]);
                $estado->setDBSenha($requestHeaders["db_password"]);
                $estado->lista(); 
                return ;
                break;
    
            case "CREATE":
                $estado = new Estado();
                $estado->setDBUsuario($requestHeaders["db_user"]);
                $estado->setDBSenha($requestHeaders["db_password"]);
                $estado->setCodTipo($requestBody["tipo"]);
                $estado->setCodConsulta($requestBody["consulta"]);
                $estado->setTermino($requestBody["termino"]);
                $estado->create();
                return;

            case "READ":
                $estado = new Estado();
                $estado->setDBUsuario($requestHeaders["db_user"]);
                $estado->setDBSenha($requestHeaders["db_password"]);
                $estado->setCodConsulta($requestHeaders["consulta"]);
                $estado->read();
                return;

            case "UPDATE":
                $estado = new Estado();
                $estado->setDBUsuario($requestHeaders["db_user"]);
                $estado->setDBSenha($requestHeaders["db_password"]);
                $estado->setCodEstado($requestBody["_id"]);
                $estado->update();
                return;
            
            default:
                http_response_code(400);
                echo 'Erro: Opção de Ação inválida!';
                return;
        }
    }

    ?>