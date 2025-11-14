<?php
include 'db_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (isset($_POST['nome']) && isset($_POST['tentativas'])) {
        
        $nome = mysqli_real_escape_string($conn, $_POST['nome']);
        $tentativas = (int)$_POST['tentativas'];

        $sql = "INSERT INTO pontuacoes (nome_jogador, tentativas) VALUES ('$nome', $tentativas)";

        if (mysqli_query($conn, $sql)) {
            $mensagem = "Pontuação salva com sucesso!";
            $status = "success";
        } else {
            $mensagem = "Erro ao salvar a pontuação: " . mysqli_error($conn);
            $status = "error";
            http_response_code(500);
        }

        mysqli_close($conn);

    } else {
        $mensagem = "Dados incompletos.";
        $status = "error";
        http_response_code(400);
    }

    // Se for AJAX
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode(['status' => $status, 'message' => $mensagem]);
    } else {
        // Se for envio de formulário normal (Método 2)
        echo $mensagem;
        echo "<br>Redirecionando para o placar...";
        // MODIFICADO: Redireciona para a página do placar
        header("refresh:3;url=index.php?page=placar");
    }

} else {
    header("Location: index.php");
    exit;
}
?>
