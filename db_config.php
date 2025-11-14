<?php

include('credentials.php');

$conn = mysqli_connect($server, $user, $pass, $db);

if (!$conn) {
    die("ERRO: Não foi possível conectar ao banco de dados. " . mysqli_connect_error());
}
?>
