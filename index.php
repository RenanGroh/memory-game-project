<?php
// Define a página padrão
$pagina = isset($_GET['page']) ? $_GET['page'] : 'jogar';

// Define o título com base na página
if ($pagina == 'placar') {
    $titulo_pagina = "Placar de Pontuações";
} else {
    $titulo_pagina = "Jogo da Memória";
}

// Inclui o cabeçalho global
include 'includes/header.php';

// Inclui o menu global
include 'includes/menu.php';

// Carrega o conteúdo da página solicitada
switch ($pagina) {
    case 'placar':
        include 'includes/page_placar.php';
        break;
    
    // O padrão (default) é carregar a página do jogo
    case 'jogar':
    default:
        include 'includes/page_jogar.php';
        break;
}

// Inclui o rodapé global
include 'includes/footer.php';
?>
