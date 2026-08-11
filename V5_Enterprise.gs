/**
 * V5 Enterprise - Backend
 * Acrescenta login simples, envio de relatório e upload de evidências.
 * Execute configurarV5() UMA VEZ depois de atualizar o código.
 */
const V5 = {
  ABA_USUARIOS: 'Usuarios',
  ABA_TAREFAS: 'Tarefas',
  ABA_EVIDENCIAS: 'Evidencias',
  PASTA_EVIDENCIAS: 'Prioridades Estratégicas - Evidências'
};

function configurarV5() {
  const ss = SpreadsheetApp.getActive();
  criarAbaV5_(ss, V5.ABA_USUARIOS, ['email','codigo','nome','perfil','igreja','ativo']);
  criarAbaV5_(ss, V5.ABA_TAREFAS, ['id','igreja','ano','titulo','responsavel','prazo','status','ultima_atualizacao']);
  criarAbaV5_(ss, V5.ABA_EVIDENCIAS, ['id','registro_id','igreja','descricao','arquivo','url','data','usuario']);

  const sh = ss.getSheetByName(V5.ABA_USUARIOS);
  if (sh.getLastRow() === 1) {
    sh.getRange(2,1,3,6).setValues([
      ['pastor@distrito.org','1234','Pastor Distrital','Pastor Distrital','Todas',true],
      ['central@igreja.org','1234','Ancião/Secretária Central','Ancião/Secretária Local','Central',true],
      ['admin@mopa.org','1234','Administrador da Missão','Administrador da Missão','Todas',true]
    ]);
  }
}

function criarAbaV5_(ss,nome,headers){
  let sh=ss.getSheetByName(nome);
  if(!sh) sh=ss.insertSheet(nome);
  if(sh.getLastRow()===0) sh.getRange(1,1,1,headers.length).setValues([headers]);
  sh.setFrozenRows(1);
}

function autenticarV5(email,codigo){
  const sh=SpreadsheetApp.getActive().getSheetByName(V5.ABA_USUARIOS);
  if(!sh) throw new Error('Execute configurarV5().');
  const data=sh.getDataRange().getDisplayValues();
  const headers=data.shift();
  const row=data.find(r=>r[0]===email && r[1]===codigo && String(r[5]).toLowerCase()!=='false');
  if(!row) return null;
  const obj={}; headers.forEach((h,i)=>obj[h]=row[i]); delete obj.codigo; return obj;
}

function enviarRelatorioV5(email,igreja,ano){
  const dados=listarDados().filter(r=>String(r.ano)===String(ano)&&(igreja==='Todas'||r.igreja===igreja));
  const meta=dados.reduce((s,r)=>s+Number(r.meta||0),0);
  const alc=dados.reduce((s,r)=>s+Number(r.alcancado||0),0);
  const percentual=meta?Math.round(alc/meta*100):0;
  const assunto=`Relatório Prioridades Estratégicas - ${igreja} - ${ano}`;
  const corpo=`Relatório das Prioridades Estratégicas\n\nIgreja: ${igreja}\nAno: ${ano}\nResultado geral: ${percentual}%\nMeta total: ${meta}\nRealizado: ${alc}`;
  MailApp.sendEmail(email,assunto,corpo);
  return true;
}

function salvarEvidenciaV5(p){
  if(!p.base64 || !p.fileName) throw new Error('Arquivo ausente.');
  const folder=getEvidenceFolder_();
  const bytes=Utilities.base64Decode(p.base64);
  const blob=Utilities.newBlob(bytes,p.mimeType||'application/octet-stream',p.fileName);
  const file=folder.createFile(blob);
  const sh=SpreadsheetApp.getActive().getSheetByName(V5.ABA_EVIDENCIAS);
  sh.appendRow([Utilities.getUuid(),p.registro_id||'',p.igreja||'',p.descricao||'',p.fileName,file.getUrl(),new Date(),p.usuario||'']);
  return {url:file.getUrl(),name:file.getName()};
}

function getEvidenceFolder_(){
  const it=DriveApp.getFoldersByName(V5.PASTA_EVIDENCIAS);
  return it.hasNext()?it.next():DriveApp.createFolder(V5.PASTA_EVIDENCIAS);
}

/*
 * Integre estas ações no doGet/doPost já existente:
 *
 * doGet:
 * if (action === 'login') payload = {ok:true,user:autenticarV5(e.parameter.email,e.parameter.codigo)};
 *
 * doPost:
 * if (p.action === 'sendReport') return jsonResponse({ok:true,data:enviarRelatorioV5(p.email,p.igreja,p.ano)});
 * if (p.action === 'uploadEvidence') return jsonResponse({ok:true,data:salvarEvidenciaV5(p)});
 *
 * Depois, crie NOVA VERSÃO da implantação.
 */
