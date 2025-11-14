<?php
// Inclui a configuração do DB para buscar os dados
include 'db_config.php';

// Query para buscar as pontuações
// Ordena por 'tentativas' ASC (ascendente), pois menos tentativas é melhor.
// O usuário pediu "decrescente", que interpretamos como ordem de ranking (do 1º lugar para baixo).
$sql = "SELECT nome_jogador, tentativas, data_jogo FROM pontuacoes ORDER BY tentativas ASC LIMIT 20";

// Executa a query
$resultado = mysqli_query($conn, $sql);
?>

<div class="placar-container">
    <h2>Melhores Pontuações</h2>
    
    <?php 
    // Verifica se a query foi bem-sucedida e se retornou linhas
    if ($resultado && mysqli_num_rows($resultado) > 0): 
    ?>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Nome</th>
                    <th>Tentativas</th>
                    <th>Data</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $rank = 1;
                // Loop pelos resultados e exibe cada linha
                while ($linha = mysqli_fetch_assoc($resultado)): 
                    // Formata a data para o padrão brasileiro
                    $data_formatada = date("d/m/Y H:i", strtotime($linha['data_jogo']));
                ?>
                    <tr>
                        <td><?php echo $rank++; ?>º</td>
                        <td><?php echo htmlspecialchars($linha['nome_jogador']); ?></td>
                        <td><?php echo $linha['tentativas']; ?></td>
                        <td><?php echo $data_formatada; ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Nenhuma pontuação registrada ainda. Seja o primeiro!</p>
    <?php endif; ?>
    
    <?php
    // Libera a memória do resultado
    if ($resultado) {
        mysqli_free_result($resultado);
    }
    // Fecha a conexão
    mysqli_close($conn);
    ?>
</div>
