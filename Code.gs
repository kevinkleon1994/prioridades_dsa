/**
 * Banco de dados do Dashboard das Ênfases Estratégicas
 * Distrito de Castelo de Sonhos
 *
 * 1. Crie uma Planilha Google vazia.
 * 2. Extensões > Apps Script.
 * 3. Cole este código em Code.gs.
 * 4. Execute configurarBancoDeDados() uma vez.
 * 5. Implantar > Nova implantação > Aplicativo da Web.
 * 6. Executar como: você.
 * 7. Quem pode acessar: qualquer pessoa.
 */

const CONFIG = {
  ABA_DADOS: 'Dados',
  ABA_IGREJAS: 'Igrejas',
  ABA_REQUISITOS: 'Requisitos',
  DISTRITO: 'Castelo de Sonhos'
};

const IGREJAS = ["Central", "Cachoeira da Serra", "Jardim Vitória", "Jardim Planalto", "PDS Brasília", "Vila Isol", "Terra Nossa", "Pedra Alta"];
const REQUISITOS = [{"codigo_requisito": "ID-01", "area": "Identidade", "titulo": "Patriarcas e Profetas", "descricao": "Estudar semanalmente o livro Patriarcas e Profetas (Os Escolhidos), incluindo o minuto profético.", "pergunta": "Como a igreja fará para alcançar o número correspondente a 60% dos membros estudando semanalmente o livro?", "meta_padrao": 60}, {"codigo_requisito": "ID-02", "area": "Identidade", "titulo": "Nisto Cremos", "descricao": "Realizar, nos cultos evangelísticos aos domingos, o estudo do livro Nisto Cremos.", "pergunta": "Como a igreja realizará os cultos evangelísticos aos domingos com o estudo do livro Nisto Cremos?", "meta_padrao": 100}, {"codigo_requisito": "ID-03", "area": "Identidade", "titulo": "Classe pós-batismal", "descricao": "Manter classe pós-batismal permanente como unidade da Escola Sabatina.", "pergunta": "Como a igreja garantirá que todos os novos batizados estejam matriculados e participem regularmente?", "meta_padrao": 100}, {"codigo_requisito": "ID-04", "area": "Identidade", "titulo": "Capacitação dos professores", "descricao": "Capacitar professores das classes pós-batismais Vivendo em Cristo.", "pergunta": "Como a igreja capacitará e treinará os professores das classes pós-batismais?", "meta_padrao": 100}, {"codigo_requisito": "LI-01", "area": "Liderança", "titulo": "Desenvolvimento do ancionato", "descricao": "Envolver pelo menos 50% do ancionato em programas mensais, trimestrais e anuais.", "pergunta": "Como a igreja alcançará pelo menos 50% do ancionato nos programas mensais, trimestrais e anuais?", "meta_padrao": 50}, {"codigo_requisito": "LI-02", "area": "Liderança", "titulo": "Integração da MOPa", "descricao": "Alcançar pelo menos 50% da liderança participando do Integração da MOPa.", "pergunta": "Como a igreja inserirá pelo menos 50% da liderança no Integração da MOPa?", "meta_padrao": 50}, {"codigo_requisito": "LI-03", "area": "Liderança", "titulo": "Formação de líderes", "descricao": "Formar e desenvolver líderes dos diferentes departamentos da igreja.", "pergunta": "Quais ações serão realizadas para formar e desenvolver os líderes dos departamentos?", "meta_padrao": 90}, {"codigo_requisito": "LI-04", "area": "Liderança", "titulo": "Competências pastorais", "descricao": "Acompanhar pastores e fortalecer suas competências pastorais.", "pergunta": "Como será realizado o acompanhamento e fortalecimento das competências pastorais?", "meta_padrao": 80}, {"codigo_requisito": "NG-01", "area": "Novas Gerações", "titulo": "Plataforma de diálogo", "descricao": "Criar diálogo entre líderes, pastores e jovens para ampliar o engajamento missionário.", "pergunta": "Como a igreja estabelecerá diálogo entre líderes, pastores e jovens?", "meta_padrao": 100}, {"codigo_requisito": "NG-02", "area": "Novas Gerações", "titulo": "Fidelidade cristã", "descricao": "Ampliar a prática da fidelidade cristã através do 7me e aplicativos adequados.", "pergunta": "O que será feito para ampliar a fidelidade cristã entre as novas gerações?", "meta_padrao": 45}, {"codigo_requisito": "NG-03", "area": "Novas Gerações", "titulo": "Jovens no ancionato", "descricao": "Integrar jovens à liderança com acompanhamento de anciãos experientes.", "pergunta": "Como os jovens serão integrados à liderança e acompanhados por anciãos experientes?", "meta_padrao": 20}, {"codigo_requisito": "NG-04", "area": "Novas Gerações", "titulo": "Palavra e missão", "descricao": "Integrar crianças, juvenis, adolescentes e jovens no estudo e ensino da Palavra.", "pergunta": "Quais passos serão usados para envolver as novas gerações no estudo, vivência e ensino da Palavra?", "meta_padrao": 60}, {"codigo_requisito": "NG-05", "area": "Novas Gerações", "titulo": "Vida familiar cristã", "descricao": "Fortalecer culto familiar, fidelidade e envolvimento missionário.", "pergunta": "Quais ações fortalecerão a vida cristã, o culto familiar e o envolvimento missionário?", "meta_padrao": 100}, {"codigo_requisito": "DI-01", "area": "Discipulado", "titulo": "Escola Sabatina Viva", "descricao": "Reorganizar a Escola Sabatina e alcançar membros no estudo diário da lição.", "pergunta": "Como a igreja alcançará a meta de membros estudando diariamente a Lição da Escola Sabatina?", "meta_padrao": 40}, {"codigo_requisito": "DI-02", "area": "Discipulado", "titulo": "EDMC e ELMC", "descricao": "Consolidar os programas de discipulado em distritos e congregações.", "pergunta": "Como a igreja local será organizada para receber a EDMC e atender novos conversos e interessados?", "meta_padrao": 30}, {"codigo_requisito": "DI-03", "area": "Discipulado", "titulo": "Estratégias missionárias", "descricao": "Envolver a maioria dos membros na missão e no ensino da Bíblia.", "pergunta": "Como a igreja trabalhará as diferentes estratégias missionárias para envolver a maioria dos membros?", "meta_padrao": 100}, {"codigo_requisito": "DI-04", "area": "Discipulado", "titulo": "Escola de Missão", "descricao": "Preparar jovens para o Serviço Voluntário Adventista.", "pergunta": "Quem representará o distrito na Escola de Missão e como serão providenciadas as passagens?", "meta_padrao": 100}, {"codigo_requisito": "DI-05", "area": "Discipulado", "titulo": "Desenvolvimento dos dons", "descricao": "Capacitar membros para reconhecer e desenvolver seus dons.", "pergunta": "Como os membros serão capacitados para reconhecer e desenvolver seus dons?", "meta_padrao": 100}, {"codigo_requisito": "DI-06", "area": "Discipulado", "titulo": "Estudos bíblicos", "descricao": "Ampliar o número de membros que ministram estudos bíblicos.", "pergunta": "Como a igreja ampliará o número de membros ministrando estudos bíblicos?", "meta_padrao": 50}];

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'list');
    let payload;

    if (action === 'login') {
      payload = { ok: true, user: autenticarPublicoV101(e.parameter.email, e.parameter.codigo) };
    } else if (action === 'listUsers') {
      payload = { ok: true, data: listarUsuariosV101() };
    } else if (action === 'listChurchStats') {
      payload = { ok: true, data: listarEstatisticasIgrejasV83() };
    } else if (action === 'dailyVerse') {
      payload = { ok: true, data: listarVersiculoDiaV83(e.parameter.data) };
    } else if (action === 'listEvidences') {
      payload = { ok: true, data: listarEvidenciasV101(e.parameter.igreja) };
    } else if (action === 'listRequirements') {
      payload = { ok: true, data: listarRequisitosV101(e.parameter.igreja) };
    } else if (action === 'listChurchProfiles') {
      payload = { ok: true, data: listarPerfisIgrejasV84() };
    } else if (action === 'refreshSystem') {
      payload = atualizarSistemaV84();
    } else if (action === 'aiChurchReport') {
      payload = { ok: true, data: gerarRelatorioIAV85(e.parameter.igreja,e.parameter.ano,e.parameter.usuario) };
    } else if (action === 'listPlanner') {
      payload = { ok: true, data: listarPlannerV101(e.parameter.igreja,e.parameter.ano) };
    } else if (action === 'listReports') {
      payload = { ok: true, data: listarRelatoriosV101(e.parameter.igreja,e.parameter.ano) };
    } else if (action === 'listChurchRequirements') {
      payload = { ok: true, data: listarRequisitosV101(e.parameter.igreja) };
    } else if (action === 'validatePassword') {
      payload = { ok: true, valid: validarSenhaUsuarioV101(e.parameter.login,e.parameter.senha) };
    } else if (action === 'listFieldChurches') {
      payload = { ok: true, data: listarUnidadesCampoV101() };
    } else if (action === 'health') {
      payload = { ok: true, service: 'Dashboard Ênfases', district: CONFIG.DISTRITO };
    } else if (action === 'list') {
      payload = { ok: true, data: listarDadosV84() };
    } else {
      payload = { ok: false, error: 'Ação GET inválida.' };
    }

    const callback = String((e && e.parameter && e.parameter.callback) || '').trim();
    return callback ? jsonpResponse(callback, payload) : jsonResponse(payload);
  } catch (error) {
    const payload = { ok: false, error: error.message, stack: error.stack };
    const callback = String((e && e.parameter && e.parameter.callback) || '').trim();
    return callback ? jsonpResponse(callback, payload) : jsonResponse(payload);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = (e && e.parameter) || {};
    if (String(p.action || '') === 'saveRequirement') {
      return jsonResponse({ ok: true, data: salvarRequisitoV101(p) });
    }
    if (String(p.action || '') === 'savePlanner') {
      return jsonResponse({ ok: true, data: salvarPlannerV101(p) });
    }
    if (String(p.action || '') === 'deletePlanner') {
      return jsonResponse({ ok: true, data: excluirPlannerV101(p) });
    }
    if (String(p.action || '') === 'saveReport') {
      return jsonResponse({ ok: true, data: salvarRelatorioV101(p) });
    }
    if (String(p.action || '') === 'deleteReport') {
      return jsonResponse({ ok: true, data: excluirRelatorioV101(p) });
    }
    if (String(p.action || '') === 'saveChurchProfile') {
      return jsonResponse({ ok: true, data: salvarPerfilIgrejaV101(p) });
    }
    if (String(p.action || '') === 'uploadEvidence') {
      return jsonResponse({ ok: true, data: enviarEvidenciaV83(p) });
    }
    if (String(p.action || '') === 'saveEvidence') {
      return jsonResponse({ ok: true, data: salvarEvidenciaV83(p) });
    }
    if (String(p.action || '') === 'deleteEvidence') {
      return jsonResponse({ ok: true, data: excluirEvidenciaV101(p) });
    }
    if (String(p.action || '') === 'saveChurchStats') {
      return jsonResponse({ ok: true, data: salvarEstatisticasIgrejaV83(p) });
    }
    if (String(p.action || '') === 'saveUser') {
      return jsonResponse({ ok: true, data: salvarUsuarioV101(p) });
    }
    if (String(p.action || '') === 'deleteUser') {
      return jsonResponse({ ok: true, data: excluirUsuarioV101(p) });
    }
    if (String(p.action || '') !== 'save') throw new Error('Ação POST inválida.');
    const saved = salvarRegistro(p);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true, data: saved });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function configurarBancoDeDados() {
  const ss = SpreadsheetApp.getActive();
  criarOuLimparAba_(ss, CONFIG.ABA_IGREJAS, ['igreja', 'distrito', 'ativo']);
  criarOuLimparAba_(ss, CONFIG.ABA_REQUISITOS, ['codigo_requisito','area','titulo','descricao','pergunta','meta_padrao','ativo']);
  criarOuLimparAba_(ss, CONFIG.ABA_DADOS, [
    'id','igreja','distrito','ano','codigo_requisito','area','titulo','descricao','pergunta',
    'meta','alcancado','plano_acao','responsavel','data_inicial','voto','material','ultima_atualizacao'
  ]);

  const igrejasSheet = ss.getSheetByName(CONFIG.ABA_IGREJAS);
  const requisitosSheet = ss.getSheetByName(CONFIG.ABA_REQUISITOS);
  const dadosSheet = ss.getSheetByName(CONFIG.ABA_DADOS);

  igrejasSheet.getRange(2,1,IGREJAS.length,3).setValues(
    IGREJAS.map(nome => [nome, CONFIG.DISTRITO, true])
  );

  requisitosSheet.getRange(2,1,REQUISITOS.length,7).setValues(
    REQUISITOS.map(r => [
      r.codigo_requisito, r.area, r.titulo, r.descricao, r.pergunta, r.meta_padrao, true
    ])
  );

  const anos = [2026,2027,2028,2029,2030];
  const linhas = [];
  IGREJAS.forEach(igreja => anos.forEach(ano => REQUISITOS.forEach(r => {
    linhas.push([
      gerarId_(igreja, ano, r.codigo_requisito),
      igreja, CONFIG.DISTRITO, ano, r.codigo_requisito, r.area, r.titulo, r.descricao, r.pergunta,
      r.meta_padrao, 0, '', '', '', '', '', new Date()
    ]);
  })));
  dadosSheet.getRange(2,1,linhas.length,linhas[0].length).setValues(linhas);

  formatarAbas_(ss);
  return `Banco configurado: ${linhas.length} registros criados.`;
}

function listarDados() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.ABA_DADOS);
  if (!sheet) throw new Error('A aba Dados não existe. Execute configurarBancoDeDados().');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  const headers = values.shift().map(String);
  return values.filter(row => row[0]).map(row => {
    const obj = {};
    headers.forEach((h,i) => obj[h] = row[i]);
    obj.meta = numero_(obj.meta);
    obj.alcancado = numero_(obj.alcancado);
    return obj;
  });
}

function salvarRegistro(p) {
  validar_(p);
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.ABA_DADOS);
  if (!sheet) throw new Error('A aba Dados não existe.');

  const id = p.id || gerarId_(p.igreja, p.ano, p.codigo_requisito);
  const finder = sheet.getRange('A:A').createTextFinder(id).matchEntireCell(true).findNext();
  const row = finder ? finder.getRow() : sheet.getLastRow() + 1;

  const values = [[
    id,
    p.igreja,
    p.distrito || CONFIG.DISTRITO,
    Number(p.ano),
    p.codigo_requisito,
    p.area,
    p.titulo,
    p.descricao,
    p.pergunta,
    numero_(p.meta),
    numero_(p.alcancado),
    p.plano_acao || '',
    p.responsavel || '',
    p.data_inicial || '',
    p.voto || '',
    p.material || '',
    new Date()
  ]];
  sheet.getRange(row,1,1,values[0].length).setValues(values);
  return { id: id, row: row };
}

function validar_(p) {
  ['igreja','ano','codigo_requisito','area','titulo'].forEach(campo => {
    if (!String(p[campo] || '').trim()) throw new Error(`Campo obrigatório ausente: ${campo}`);
  });
  if (!IGREJAS.includes(String(p.igreja))) throw new Error('Igreja não cadastrada.');
}

function gerarId_(igreja, ano, codigo) {
  return [igreja, ano, codigo].join('|');
}

function numero_(value) {
  if (typeof value === 'number') return value;
  const normalized = String(value || '0').replace(/\./g,'').replace(',','.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function criarOuLimparAba_(ss, nome, headers) {
  let sheet = ss.getSheetByName(nome);
  if (!sheet) sheet = ss.insertSheet(nome);
  sheet.clear();
  sheet.getRange(1,1,1,headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function formatarAbas_(ss) {
  [CONFIG.ABA_IGREJAS,CONFIG.ABA_REQUISITOS,CONFIG.ABA_DADOS].forEach(nome => {
    const sheet = ss.getSheetByName(nome);
    const lastCol = sheet.getLastColumn();
    sheet.getRange(1,1,1,lastCol)
      .setFontWeight('bold')
      .setBackground('#102534')
      .setFontColor('#ffffff');
    sheet.autoResizeColumns(1,lastCol);
    sheet.setFrozenRows(1);
  });
}

function jsonpResponse(callback, payload) {
  const safeCallback = String(callback).replace(/[^a-zA-Z0-9_$\.]/g, '');
  if (!safeCallback) return jsonResponse({ ok: false, error: 'Callback inválido.' });

  return ContentService
    .createTextOutput(`${safeCallback}(${JSON.stringify(payload)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
