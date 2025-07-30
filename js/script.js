var janela1 = document.getElementById ("janela1");
var janela2 = document.getElementById ("janela2");
var botoesFechar = document.querySelectorAll(".fechar");
var rank = document.getElementById ("rank");

rank.onclick = function () {
    janela1.style.display = "block";
}

comojogar.onclick = function() {
    janela2.style.display = "block"
}

botoesFechar.forEach(function(botao) {
    botao.onclick = function() {
        janela1.style.display = "none";
        janela2.style.display = "none";
    };
});
