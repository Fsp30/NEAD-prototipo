(function () {
    var CHAVE_SESSAO = "sigaa-prototipo-autenticado";

    if (sessionStorage.getItem(CHAVE_SESSAO) === "sim") {
        window.location.replace("busca.html");
        return;
    }

    var form = document.getElementById("form-login");
    var usuario = document.getElementById("usuario");
    var senha = document.getElementById("senha");
    var erro = document.getElementById("erro-login");

    usuario.focus();

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!usuario.value.trim() || !senha.value) {
            mostrarErro("Informe o usuário e a senha para entrar.");
            return;
        }

        if (usuario.value.trim() === "admin" && senha.value === "admin") {
            sessionStorage.setItem(CHAVE_SESSAO, "sim");
            window.location.href = "busca.html";
        } else {
            mostrarErro(
                "Usuário ou senha incorretos. Use as credenciais de acesso ao protótipo, abaixo do formulário.",
            );
            senha.value = "";
            senha.focus();
        }
    });

    function mostrarErro(texto) {
        erro.textContent = texto;
        erro.hidden = false;
    }
})();
