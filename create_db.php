<?php 

include('credentials.php');

$conn = mysqli_connect($server, $user, $pass);
if(!$conn){
  die('Erro ao conectar ao BD:' . mysqli_connect_error());
}

$sql = "CREATE DATABASE $db";

if(!mysqli_query($conn,$sql)){
  die('Erro ao criar BD:' . mysqli_error($conn));
}

$sql = "USE $db";

if(!mysqli_query($conn,$sql)){
  die('Erro ao selecionar BD:' . mysqli_error($conn));
}

$sql = "CREATE TABLE pontuacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_jogador VARCHAR(100) NOT NULL,
    tentativas INT NOT NULL,
    data_jogo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );";


if(!mysqli_query($conn,$sql)){
  die('Erro ao criar Tabela:' . mysqli_error($conn));
}

?>
