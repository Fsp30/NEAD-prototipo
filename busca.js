(function () {
    var form = document.getElementById("form-busca");
    var campoMatricula = document.getElementById("matricula");
    var campoCpf = document.getElementById("cpf");
    var campoNome = document.getElementById("nome");
    var campoCurso = document.getElementById("curso");
    var campoCampus = document.getElementById("campus");
    var campoTipoAno = document.getElementById("tipo-ano");
    var campoAno = document.getElementById("ano");
    var corpoTabela = document.getElementById("resultados");
    var total = document.getElementById("total");
    var botaoPdfTodos = document.getElementById("botao-pdf-todos");

    var listaAtual = ALUNOS;
    var filtroAtivo = false;

    function somenteDigitos(texto) {
        return texto.replace(/\D/g, "");
    }

    function semAcento(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function escapar(texto) {
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function formatarData(iso) {
        var p = iso.split("-");
        return p[2] + "/" + p[1] + "/" + p[0];
    }

    campoCpf.addEventListener("input", function () {
        var d = somenteDigitos(campoCpf.value).slice(0, 11);
        var v = d;
        if (d.length > 9)
            v =
                d.slice(0, 3) +
                "." +
                d.slice(3, 6) +
                "." +
                d.slice(6, 9) +
                "-" +
                d.slice(9);
        else if (d.length > 6)
            v = d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6);
        else if (d.length > 3) v = d.slice(0, 3) + "." + d.slice(3);
        campoCpf.value = v;
    });

    function filtrar() {
        var matricula = semAcento(campoMatricula.value.trim());
        var cpf = somenteDigitos(campoCpf.value);
        var nome = semAcento(campoNome.value.trim());
        var curso = campoCurso.value;
        var campus = campoCampus.value;
        var tipoAno = campoTipoAno.value;
        var ano = campoAno.value.trim();
        var anoNum = ano ? parseInt(ano, 10) : null;

        filtroAtivo = !!(
            matricula ||
            cpf ||
            nome ||
            curso ||
            campus ||
            tipoAno ||
            ano
        );

        return ALUNOS.filter(function (a) {
            if (matricula && semAcento(a.matricula).indexOf(matricula) === -1)
                return false;
            if (cpf && somenteDigitos(a.cpf).indexOf(cpf) === -1) return false;
            if (nome && semAcento(a.nome).indexOf(nome) === -1) return false;
            if (curso && a.curso !== curso) return false;
            if (campus && a.campus !== campus) return false;
            if (tipoAno && anoNum !== null) {
                if (tipoAno === "ingresso" && a.anoIngresso !== anoNum)
                    return false;
                if (tipoAno === "formacao" && a.anoFormacao !== anoNum)
                    return false;
            }
            return true;
        });
    }

    function exibir(lista) {
        listaAtual = lista;

        if (lista.length === 0) {
            corpoTabela.innerHTML =
                '<tr><td colspan="6" class="vazio">Nenhum aluno encontrado com os critérios informados.</td></tr>';
            total.textContent = "";
            total.hidden = true;
            return;
        }

        corpoTabela.innerHTML = lista
            .map(function (a) {
                return (
                    "<tr>" +
                    "<td>" +
                    escapar(a.matricula) +
                    "</td>" +
                    "<td>" +
                    escapar(a.cpf) +
                    "</td>" +
                    "<td>" +
                    escapar(a.nome) +
                    "</td>" +
                    "<td>" +
                    escapar(a.curso) +
                    "</td>" +
                    "<td>" +
                    escapar(a.campus) +
                    "</td>" +
                    '<td class="col-acao"><button type="button" class="botao-pdf" data-matricula="' +
                    escapar(a.matricula) +
                    '" aria-label="Baixar PDF do histórico de ' +
                    escapar(a.nome) +
                    '">Baixar PDF</button></td>' +
                    "</tr>"
                );
            })
            .join("");
        total.hidden = false;
        total.textContent =
            lista.length +
            (lista.length === 1 ? " aluno encontrado" : " alunos encontrados");
    }

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        exibir(filtrar());
    });

    // Atualiza a tabela a cada tecla digitada ou opção escolhida
    form.addEventListener("input", function () {
        exibir(filtrar());
    });

    document
        .getElementById("botao-limpar")
        .addEventListener("click", function () {
            form.reset();
            filtroAtivo = false;
            exibir(ALUNOS);
            campoMatricula.focus();
        });

    document
        .getElementById("botao-sair")
        .addEventListener("click", function () {
            sessionStorage.removeItem("sigaa-prototipo-autenticado");
            window.location.href = "index.html";
        });

    corpoTabela.addEventListener("click", function (evento) {
        var botao = evento.target.closest(".botao-pdf");
        if (!botao) return;
        var aluno = ALUNOS.find(function (a) {
            return a.matricula === botao.dataset.matricula;
        });
        if (aluno) gerarPdf(aluno);
    });

    botaoPdfTodos.addEventListener("click", function () {
        if (!listaAtual || listaAtual.length === 0) {
            alert(
                "Não há alunos para incluir no PDF. Ajuste os critérios de busca.",
            );
            return;
        }
        gerarPdfLista(listaAtual, filtroAtivo);
    });

    var COR_FAIXA = [196, 210, 235]; // #C4D2EB
    var COR_PAINEL = [239, 243, 250]; // #EFF3FA
    var COR_CABECALHO = [222, 223, 227]; // #DEDFE3
    var COR_AZUL_ESCURO = [64, 78, 130]; // #404E82
    var COR_BORDA = [184, 196, 216]; // #B8C4D8
    var COR_REPROVADO = [160, 27, 14];

    function decimal(valor) {
        return valor.toFixed(1).replace(".", ",");
    }

    function calcularIndices(a) {
        var somaNotaCh = 0,
            somaCh = 0,
            chAprovada = 0;
        a.historico.forEach(function (d) {
            somaNotaCh += d.nota * d.cargaHoraria;
            somaCh += d.cargaHoraria;
            if (d.situacao === "Aprovado") chAprovada += d.cargaHoraria;
        });
        return {
            chCursada: somaCh,
            chAprovada: chAprovada,
            mediaGeral: somaCh ? decimal(somaNotaCh / somaCh) : "-",
            ira: somaCh ? decimal(somaNotaCh / somaCh) : "-",
        };
    }

    function tituloSecao(texto, colunas) {
        return [
            {
                content: texto,
                colSpan: colunas,
                styles: {
                    halign: "center",
                    fillColor: COR_FAIXA,
                    fontStyle: "bold",
                },
            },
        ];
    }

    function rotulo(texto) {
        return {
            content: texto,
            styles: { fontStyle: "bold", fillColor: COR_PAINEL },
        };
    }

    function estiloTabelaAluno(margem) {
        return {
            theme: "grid",
            margin: { left: margem, right: margem, top: 20, bottom: 20 },
            styles: {
                font: "helvetica",
                fontSize: 8.5,
                cellPadding: 1.6,
                lineColor: COR_BORDA,
                lineWidth: 0.2,
                textColor: 20,
            },
            headStyles: {
                fillColor: COR_CABECALHO,
                textColor: 20,
                fontStyle: "bold",
            },
        };
    }

    function desenharCabecalhoAluno(doc, margem, largura) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("IF Sudeste MG - SIGAA", margem, 18);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
            "Instituto Federal do Sudeste de Minas Gerais - Histórico Escolar",
            margem,
            23,
        );
        doc.setDrawColor(
            COR_AZUL_ESCURO[0],
            COR_AZUL_ESCURO[1],
            COR_AZUL_ESCURO[2],
        );
        doc.setLineWidth(0.6);
        doc.line(margem, 26, largura - margem, 26);
    }

    function desenharDadosAluno(doc, a, margem) {
        var indices = calcularIndices(a);
        var estiloBase = estiloTabelaAluno(margem);

        doc.autoTable(
            Object.assign({}, estiloBase, {
                startY: 31,
                head: [tituloSecao("Dados Pessoais", 4)],
                body: [
                    [rotulo("Nome"), { content: a.nome, colSpan: 3 }],
                    [rotulo("Matrícula"), a.matricula, rotulo("CPF"), a.cpf],
                    [
                        rotulo("Data de nascimento"),
                        formatarData(a.nascimento),
                        rotulo("Telefone"),
                        a.telefone,
                    ],
                    [rotulo("E-mail"), { content: a.email, colSpan: 3 }],
                ],
                columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 40 } },
            }),
        );

        doc.autoTable(
            Object.assign({}, estiloBase, {
                startY: doc.lastAutoTable.finalY + 5,
                head: [tituloSecao("Dados do Curso", 4)],
                body: [
                    [rotulo("Curso"), { content: a.curso, colSpan: 3 }],
                    [
                        rotulo("Campus"),
                        a.campus,
                        rotulo("Situação do vínculo"),
                        a.vinculo,
                    ],
                    [
                        rotulo("Ano/semestre de ingresso"),
                        a.anoIngresso + "." + a.semestreIngresso,
                        rotulo("Ano de formação"),
                        a.anoFormacao ? String(a.anoFormacao) : "-",
                    ],
                    [
                        rotulo("Carga horária cursada"),
                        indices.chCursada + "h",
                        rotulo("Carga horária aprovada"),
                        indices.chAprovada + "h",
                    ],
                    [
                        rotulo("Média geral"),
                        indices.mediaGeral,
                        rotulo("IRA"),
                        indices.ira,
                    ],
                ],
                columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 40 } },
            }),
        );

        var linhas = [];
        var periodoAtual = null;
        a.historico.forEach(function (d) {
            if (d.periodo !== periodoAtual) {
                periodoAtual = d.periodo;
                linhas.push([
                    {
                        content: d.numeroPeriodo + "º período - " + d.periodo,
                        colSpan: 6,
                        styles: { fontStyle: "bold", fillColor: COR_PAINEL },
                    },
                ]);
            }
            linhas.push([
                d.periodo,
                d.disciplina,
                d.cargaHoraria + "h",
                String(d.nota),
                d.frequencia + "%",
                d.situacao,
            ]);
        });

        doc.autoTable(
            Object.assign({}, estiloBase, {
                startY: doc.lastAutoTable.finalY + 5,
                head: [
                    tituloSecao("Disciplinas Cursadas", 6),
                    [
                        "Período",
                        "Disciplina",
                        "Carga horária",
                        "Nota",
                        "Frequência",
                        "Situação",
                    ],
                ],
                body: linhas,
                showHead: "everyPage",
                columnStyles: {
                    0: { cellWidth: 18 },
                    2: { cellWidth: 24, halign: "center" },
                    3: { cellWidth: 14, halign: "center" },
                    4: { cellWidth: 22, halign: "center" },
                    5: { cellWidth: 22 },
                },
                didParseCell: function (dado) {
                    if (
                        dado.section === "head" &&
                        dado.row.index === 1 &&
                        dado.column.index >= 2 &&
                        dado.column.index <= 4
                    ) {
                        dado.cell.styles.halign = "center";
                    }
                    if (
                        dado.section === "body" &&
                        dado.column.index === 5 &&
                        dado.cell.raw === "Reprovado"
                    ) {
                        dado.cell.styles.textColor = COR_REPROVADO;
                        dado.cell.styles.fontStyle = "bold";
                    }
                },
            }),
        );
    }

    function adicionarRodapePaginas(doc, margem, largura, altura) {
        var agora = new Date();
        var emissao =
            "Emitido em " +
            agora.toLocaleDateString("pt-BR") +
            " às " +
            agora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        var regra =
            "Notas de 0 a 100. Aprovação com nota mínima 60 e frequência mínima de 75%. " +
            "IRA: média das notas ponderada pela carga horária de todas as disciplinas cursadas.";
        var totalPaginas = doc.getNumberOfPages();
        for (var pagina = 1; pagina <= totalPaginas; pagina++) {
            doc.setPage(pagina);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(80);
            doc.text(
                doc.splitTextToSize(regra, largura - margem * 2),
                margem,
                altura - 12,
            );
            doc.text(emissao, margem, altura - 5);
            doc.text(
                "Página " + pagina + " de " + totalPaginas,
                largura - margem,
                altura - 5,
                { align: "right" },
            );
        }
    }

    function gerarPdf(a) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert(
                "Não foi possível carregar a biblioteca de PDF. Verifique a conexão com a internet e recarregue a página.",
            );
            return;
        }

        var doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
        var margem = 15;
        var largura = doc.internal.pageSize.getWidth();
        var altura = doc.internal.pageSize.getHeight();

        desenharCabecalhoAluno(doc, margem, largura);
        desenharDadosAluno(doc, a, margem);
        adicionarRodapePaginas(doc, margem, largura, altura);

        doc.save("Historico_" + a.matricula + ".pdf");
    }

    function gerarPdfLista(lista, filtrado) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert(
                "Não foi possível carregar a biblioteca de PDF. Verifique a conexão com a internet e recarregue a página.",
            );
            return;
        }

        var doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
        var margem = 15;
        var largura = doc.internal.pageSize.getWidth();
        var altura = doc.internal.pageSize.getHeight();

        lista.forEach(function (a, indice) {
            if (indice > 0) doc.addPage();
            desenharCabecalhoAluno(doc, margem, largura);
            desenharDadosAluno(doc, a, margem);
        });

        adicionarRodapePaginas(doc, margem, largura, altura);

        doc.save(
            filtrado
                ? "Relatorio_Alunos_Filtrados.pdf"
                : "Relatorio_Alunos_Todos.pdf",
        );
    }

    exibir(ALUNOS);
})();
