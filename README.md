# NEAD-prototipo

Protótipo de uma tela de **busca de alunos** no estilo do SIGAA do IF Sudeste MG. Com ela é possível filtrar alunos e baixar o histórico escolar de cada um em PDF.

Todo o projeto é estático (HTML, CSS e JavaScript puro): não há servidor, banco de dados real nem etapa de build.

## Como executar

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Abra o arquivo `index.html` no navegador.
3. Entre com as credenciais do protótipo:
   - **Usuário:** `admin`
   - **Senha:** `admin`

É preciso estar conectado à internet para gerar o PDF, porque as bibliotecas jsPDF e jsPDF-AutoTable são carregadas pelo CDN do cdnjs.

## Funcionalidades

- **Login simulado:** a sessão fica guardada no `sessionStorage` e termina ao fechar a aba ou clicar em **SAIR**. Quem tentar abrir `busca.html` sem ter entrado volta para a tela de login.
- **Busca de alunos:** filtra por matrícula, CPF, nome e curso. A busca não diferencia maiúsculas de minúsculas nem considera acentos, e o CPF recebe máscara durante a digitação.
- **Histórico em PDF:** o botão **Baixar PDF** gera um histórico com os dados pessoais, os dados do curso (carga horária, média geral e IRA) e as disciplinas agrupadas por período. As reprovações aparecem em destaque.

## Estrutura

| Arquivo      | Conteúdo                                                     |
|--------------|--------------------------------------------------------------|
| `index.html` | Tela de login                                                |
| `index.js`   | Validação do login e controle da sessão                      |
| `busca.html` | Tela de busca de alunos                                      |
| `busca.js`   | Filtros, tabela de resultados e geração do PDF               |
| `db.js`      | Dados fictícios: cursos, grades curriculares e 20 alunos     |
| `style.css`  | Estilos das duas telas                                       |

## Dados fictícios

Os alunos, os CPFs e as notas são gerados em `db.js` a partir de uma semente fixa, então os dados são sempre os mesmos a cada carregamento. Os CPFs têm dígitos verificadores válidos, mas não pertencem a ninguém.

O protótipo considera 2026.1 como o último semestre concluído. A aprovação exige nota mínima 60 (em uma escala de 0 a 100) e frequência mínima de 75%.

Os cursos disponíveis são:

- Engenharia Mecatrônica
- Engenharia Elétrica
- Eventos
- Sistema de Informação

## Licença

Distribuído sob a licença Apache 2.0. Consulte o arquivo [LICENSE](LICENSE).
