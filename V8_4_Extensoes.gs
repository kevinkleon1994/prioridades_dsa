/** V8.4 - Requisitos editáveis, atualização completa, metas dinâmicas e Minha Igreja */
const V84={ABA_PERFIL_IGREJAS:'Perfil_Igrejas'};

function configurarV84(){
  configurarV83();
  configurarPerfilIgrejasV84_();
  garantirTotalMembrosV84_();
  atualizarSistemaV84();
}

function garantirTotalMembrosV84_(){
  const sh=SpreadsheetApp.getActive().getSheetByName('Igrejas');
  if(!sh)return;
  const values=sh.getDataRange().getValues();
  if(!values.length)return;
  let headers=values[0].map(String);
  if(headers.indexOf('total_membros')<0){
    sh.insertColumnAfter(3);
    sh.getRange(1,4).setValue('total_membros');
  }
  const data=sh.getDataRange().getValues();
  headers=data[0].map(String);
  const idxTotal=headers.indexOf('total_membros');
  const idxF=headers.indexOf('membros_frequentes');
  const idxN=headers.indexOf('membros_nao_frequentes');
  const idxT=headers.indexOf('membros_a_transferir');
  const idxR=headers.indexOf('membros_a_resgatar');
  for(let i=1;i<data.length;i++){
    const total=[idxF,idxN,idxT,idxR].reduce((s,idx)=>s+(idx>=0?Number(data[i][idx]||0):0),0);
    sh.getRange(i+1,idxTotal+1).setValue(total);
  }
}

function configurarPerfilIgrejasV84_(){
  const ss=SpreadsheetApp.getActive();
  let sh=ss.getSheetByName(V84.ABA_PERFIL_IGREJAS);
  if(!sh)sh=ss.insertSheet(V84.ABA_PERFIL_IGREJAS);
  if(sh.getLastRow()===0){
    const headers=['igreja','quantidade_anciaos','quantidade_familias','pastor_responsavel','telefone','endereco','email','observacoes','ultima_atualizacao','atualizado_por'];
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.getRange(2,1,IGREJAS.length,headers.length).setValues(IGREJAS.map(n=>[n,0,0,'','','','','',new Date(),'configurarV84']));
    formatarV83_(sh,headers.length);
  }
}

function listarRequisitosV84(){
  return linhasV83_(CONFIG.ABA_REQUISITOS).map(r=>{
    r.meta_padrao=Number(r.meta_padrao||0);
    r.ativo=String(r.ativo).toLowerCase()!=='false';
    return r;
  });
}

function salvarRequisitoV84(p){
  const sh=SpreadsheetApp.getActive().getSheetByName(CONFIG.ABA_REQUISITOS);
  if(!sh)throw new Error('A aba Requisitos não existe.');
  const original=String(p.codigo_original||p.codigo_requisito);
  const finder=sh.getRange('A:A').createTextFinder(original).matchEntireCell(true).findNext();
  const row=finder?finder.getRow():sh.getLastRow()+1;
  sh.getRange(row,1,1,7).setValues([[
    p.codigo_requisito,p.area,p.titulo,p.descricao||'',p.pergunta||'',
    Number(p.meta_padrao)||0,String(p.ativo).toLowerCase()!=='false'
  ]]);
  return {ok:true,row,codigo:p.codigo_requisito};
}

function listarPerfisIgrejasV84(){
  return linhasV83_(V84.ABA_PERFIL_IGREJAS).map(o=>{
    o.quantidade_anciaos=Number(o.quantidade_anciaos||0);
    o.quantidade_familias=Number(o.quantidade_familias||0);
    return o;
  });
}

function salvarPerfilIgrejaV84(p){
  const sh=SpreadsheetApp.getActive().getSheetByName(V84.ABA_PERFIL_IGREJAS);
  if(!sh)throw new Error('Execute configurarV84().');
  const finder=sh.getRange('A:A').createTextFinder(String(p.igreja)).matchEntireCell(true).findNext();
  const row=finder?finder.getRow():sh.getLastRow()+1;
  sh.getRange(row,1,1,10).setValues([[
    p.igreja,Number(p.quantidade_anciaos)||0,Number(p.quantidade_familias)||0,
    p.pastor_responsavel||'',p.telefone||'',p.endereco||'',p.email||'',p.observacoes||'',
    new Date(),p.usuario||''
  ]]);
  return {ok:true,row};
}

function listarDadosV84(){
  const dados=linhasV83_(CONFIG.ABA_DADOS);
  const reqs=listarRequisitosV84();
  const reqMap={};
  reqs.forEach(r=>reqMap[r.codigo_requisito]=r);
  const stats={};
  listarEstatisticasIgrejasV83().forEach(s=>stats[s.igreja]=s);
  return dados.filter(d=>{
    const req=reqMap[d.codigo_requisito];
    return !req||req.ativo!==false;
  }).map(d=>{
    const req=reqMap[d.codigo_requisito];
    if(req){
      d.area=req.area;d.titulo=req.titulo;d.descricao=req.descricao;d.pergunta=req.pergunta;
      if(String(d.codigo_requisito)==='ID-01'){
        d.meta=Math.ceil(Number(stats[d.igreja]?.membros_frequentes||0)*0.60);
      }else{
        d.meta=Number(d.meta||req.meta_padrao||0);
      }
    }
    d.alcancado=Number(d.alcancado||0);
    d.meta=Number(d.meta||0);
    return d;
  });
}

function atualizarSistemaV84(){
  garantirTotalMembrosV84_();
  const sh=SpreadsheetApp.getActive().getSheetByName(CONFIG.ABA_DADOS);
  if(!sh)throw new Error('A aba Dados não existe.');
  const data=sh.getDataRange().getValues();
  if(data.length<2)return {ok:true,atualizados:0};
  const headers=data[0].map(String);
  const col={};headers.forEach((h,i)=>col[h]=i);
  const reqs=listarRequisitosV84(),reqMap={};reqs.forEach(r=>reqMap[r.codigo_requisito]=r);
  const stats={};listarEstatisticasIgrejasV83().forEach(s=>stats[s.igreja]=s);
  let updated=0;
  for(let i=1;i<data.length;i++){
    const req=reqMap[String(data[i][col.codigo_requisito])];
    if(!req)continue;
    data[i][col.area]=req.area;
    data[i][col.titulo]=req.titulo;
    data[i][col.descricao]=req.descricao;
    data[i][col.pergunta]=req.pergunta;
    if(String(req.codigo_requisito)==='ID-01'){
      data[i][col.meta]=Math.ceil(Number(stats[String(data[i][col.igreja])]?.membros_frequentes||0)*0.60);
    }
    data[i][col.ultima_atualizacao]=new Date();
    updated++;
  }
  sh.getRange(2,1,data.length-1,data[0].length).setValues(data.slice(1));
  SpreadsheetApp.flush();
  return {ok:true,atualizados:updated,data:listarDadosV84()};
}
