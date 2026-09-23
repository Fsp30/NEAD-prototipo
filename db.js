/* Dados fictícios do protótipo: cursos, disciplinas e 20 alunos.
   As notas são geradas com uma semente fixa, então são sempre as mesmas a cada carregamento. */

var CURSOS = {
  'Engenharia Mecatrônica': [
    [['Cálculo I', 90], ['Geometria Analítica', 60], ['Introdução à Mecatrônica', 30]],
    [['Cálculo II', 90], ['Física I', 60], ['Desenho Técnico', 60]],
    [['Cálculo III', 60], ['Física II', 60], ['Programação Estruturada', 60]],
    [['Mecânica dos Sólidos', 60], ['Eletrônica Analógica', 60], ['Ciência dos Materiais', 60]],
    [['Eletrônica Digital', 60], ['Processos de Fabricação', 60], ['Sinais e Sistemas', 60]],
    [['Microcontroladores', 60], ['Elementos de Máquinas', 60], ['Sistemas Hidráulicos e Pneumáticos', 60]],
    [['Controle Automático I', 60], ['Sensores e Atuadores', 60], ['Instrumentação Industrial', 60]],
    [['Controle Automático II', 60], ['Robótica I', 60], ['Controladores Lógicos Programáveis', 60]],
    [['Robótica II', 60], ['Visão Computacional', 60], ['Projeto Integrador', 90]],
    [['Trabalho de Conclusão de Curso', 60], ['Gestão da Produção', 30], ['Estágio Supervisionado', 160]]
  ],
  'Engenharia Elétrica': [
    [['Cálculo I', 90], ['Álgebra Linear', 60], ['Introdução à Engenharia Elétrica', 30]],
    [['Cálculo II', 90], ['Física I', 60], ['Algoritmos e Programação', 60]],
    [['Cálculo III', 60], ['Física III', 60], ['Circuitos Elétricos I', 60]],
    [['Circuitos Elétricos II', 60], ['Eletromagnetismo', 60], ['Eletrônica I', 60]],
    [['Eletrônica II', 60], ['Materiais Elétricos', 60], ['Sinais e Sistemas', 60]],
    [['Conversão de Energia', 60], ['Instalações Elétricas', 60], ['Medidas Elétricas', 60]],
    [['Máquinas Elétricas', 60], ['Sistemas de Controle', 60], ['Eletrônica de Potência', 60]],
    [['Sistemas Elétricos de Potência', 60], ['Acionamentos Elétricos', 60], ['Proteção de Sistemas Elétricos', 60]],
    [['Qualidade de Energia', 60], ['Fontes Renováveis de Energia', 60], ['Projeto de Subestações', 60]],
    [['Trabalho de Conclusão de Curso', 60], ['Eficiência Energética', 30], ['Estágio Supervisionado', 160]]
  ],
  'Eventos': [
    [['Introdução ao Turismo e Eventos', 60], ['Comunicação Empresarial', 60], ['Cerimonial e Protocolo I', 60]],
    [['Planejamento de Eventos', 60], ['Marketing de Eventos', 60], ['Cerimonial e Protocolo II', 60]],
    [['Gestão Financeira de Eventos', 60], ['Captação de Recursos e Patrocínio', 60], ['Alimentos e Bebidas', 60]],
    [['Produção Cultural', 60], ['Legislação Aplicada a Eventos', 30], ['Projeto Integrador de Eventos', 90]],
    [['Eventos Sustentáveis', 60], ['Empreendedorismo', 60], ['Estágio Supervisionado', 120]]
  ],
  'Sistema de Informação': [
    [['Algoritmos e Lógica de Programação', 90], ['Fundamentos de Sistemas de Informação', 60], ['Matemática Discreta', 60]],
    [['Programação Orientada a Objetos', 90], ['Arquitetura de Computadores', 60], ['Cálculo I', 60]],
    [['Estruturas de Dados', 90], ['Banco de Dados I', 60], ['Probabilidade e Estatística', 60]],
    [['Engenharia de Software I', 60], ['Banco de Dados II', 60], ['Sistemas Operacionais', 60]],
    [['Engenharia de Software II', 60], ['Redes de Computadores', 60], ['Desenvolvimento Web', 60]],
    [['Interação Humano-Computador', 60], ['Segurança da Informação', 60], ['Desenvolvimento Mobile', 60]],
    [['Gerência de Projetos', 60], ['Inteligência Artificial', 60], ['Trabalho de Conclusão de Curso I', 30]],
    [['Governança de TI', 60], ['Empreendedorismo', 30], ['Trabalho de Conclusão de Curso II', 60]]
  ]
};

var CODIGO_CURSO = {
  'Engenharia Mecatrônica': 'EMC',
  'Engenharia Elétrica': 'EEL',
  'Eventos': 'EVT',
  'Sistema de Informação': 'SIN'
};

/* Último semestre já concluído no protótipo */
var ANO_ATUAL = 2026;
var SEMESTRE_ATUAL = 1;

/* Gerador pseudoaleatório com semente fixa (mulberry32) */
function criarAleatorio(semente) {
  return function () {
    semente |= 0; semente = semente + 0x6D2B79F5 | 0;
    var t = Math.imul(semente ^ semente >>> 15, 1 | semente);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function inteiro(rand, min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/* CPF fictício com dígitos verificadores válidos */
function gerarCpf(rand) {
  var n = [];
  for (var i = 0; i < 9; i++) n.push(inteiro(rand, 0, 9));
  for (var d = 0; d < 2; d++) {
    var soma = 0, peso = n.length + 1;
    for (var j = 0; j < n.length; j++) soma += n[j] * (peso - j);
    var resto = (soma * 10) % 11;
    n.push(resto === 10 ? 0 : resto);
  }
  var s = n.join('');
  return s.slice(0, 3) + '.' + s.slice(3, 6) + '.' + s.slice(6, 9) + '-' + s.slice(9);
}

var BASE_ALUNOS = [
  ['Lucas Andrade Ribeiro', 'Engenharia Mecatrônica', 2021, 1, '2002-03-14'],
  ['Mariana Costa Almeida', 'Sistema de Informação', 2023, 1, '2004-07-22'],
  ['Gabriel Henrique Moreira', 'Engenharia Elétrica', 2022, 2, '2003-11-05'],
  ['Beatriz Fernandes Lima', 'Eventos', 2024, 1, '2005-01-30'],
  ['Rafael Souza Teixeira', 'Engenharia Mecatrônica', 2023, 2, '2004-09-18'],
  ['Juliana Pereira Campos', 'Sistema de Informação', 2022, 1, '2003-05-09'],
  ['Pedro Augusto Barbosa', 'Engenharia Elétrica', 2020, 1, '2001-12-02'],
  ['Larissa Martins Rocha', 'Eventos', 2025, 1, '2006-04-11'],
  ['Thiago Oliveira Duarte', 'Sistema de Informação', 2024, 2, '2005-08-27'],
  ['Camila Rodrigues Nunes', 'Engenharia Mecatrônica', 2022, 1, '2003-02-19'],
  ['Felipe Carvalho Mendes', 'Engenharia Elétrica', 2024, 1, '2005-10-03'],
  ['Isabela Gomes Vieira', 'Eventos', 2023, 2, '2004-06-15'],
  ['Matheus Lopes Cardoso', 'Sistema de Informação', 2021, 2, '2002-01-25'],
  ['Amanda Ribeiro Freitas', 'Engenharia Mecatrônica', 2025, 1, '2006-03-08'],
  ['Vinícius Araújo Pinto', 'Engenharia Elétrica', 2023, 1, '2004-12-12'],
  ['Letícia Santos Moura', 'Eventos', 2022, 2, '2003-09-29'],
  ['Gustavo Nascimento Reis', 'Sistema de Informação', 2025, 2, '2006-07-04'],
  ['Carolina Dias Monteiro', 'Engenharia Mecatrônica', 2020, 2, '2001-08-21'],
  ['Bruno Castro Azevedo', 'Engenharia Elétrica', 2021, 2, '2002-10-17'],
  ['Natália Farias Coelho', 'Sistema de Informação', 2020, 1, '2001-04-06']
];

function montarHistorico(rand, curso, ano, semestre) {
  var grade = CURSOS[curso];
  var concluidos = (ANO_ATUAL - ano) * 2 + (SEMESTRE_ATUAL - semestre) + 1;
  var total = Math.min(concluidos, grade.length);
  var historico = [];
  var a = ano, s = semestre;
  for (var p = 0; p < total; p++) {
    grade[p].forEach(function (disc) {
      var nota = inteiro(rand, 0, 99) < 12 ? inteiro(rand, 25, 59) : inteiro(rand, 60, 100);
      var frequencia = inteiro(rand, 0, 99) < 6 ? inteiro(rand, 55, 74) : inteiro(rand, 75, 100);
      historico.push({
        periodo: a + '.' + s,
        numeroPeriodo: p + 1,
        disciplina: disc[0],
        cargaHoraria: disc[1],
        nota: nota,
        frequencia: frequencia,
        situacao: nota >= 60 && frequencia >= 75 ? 'Aprovado' : 'Reprovado'
      });
    });
    if (s === 1) { s = 2; } else { s = 1; a++; }
  }
  return { disciplinas: historico, concluiuCurso: concluidos >= grade.length };
}

var ALUNOS = BASE_ALUNOS.map(function (b, i) {
  var rand = criarAleatorio(1000 + i * 37);
  var nome = b[0], curso = b[1], ano = b[2], semestre = b[3];
  var h = montarHistorico(rand, curso, ano, semestre);
  var partes = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
  return {
    nome: nome,
    curso: curso,
    anoIngresso: ano,
    semestreIngresso: semestre,
    nascimento: b[4],
    matricula: String(ano) + semestre + CODIGO_CURSO[curso] + String(i + 1).padStart(4, '0'),
    cpf: gerarCpf(rand),
    email: partes[0] + '.' + partes[partes.length - 1] + '@estudante.ifsudestemg.edu.br',
    telefone: '(32) 9' + inteiro(rand, 8000, 9999) + '-' + String(inteiro(rand, 0, 9999)).padStart(4, '0'),
    vinculo: h.concluiuCurso && h.disciplinas.every(function (d) { return d.situacao === 'Aprovado'; }) ? 'Formado' : 'Ativo',
    historico: h.disciplinas
  };
});