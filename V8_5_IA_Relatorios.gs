/**
 * V8.5 — Relatórios estratégicos com IA e contato do representante local
 * Configure GEMINI_API_KEY em: Configurações do projeto > Propriedades do script.
 * Opcional: GEMINI_MODEL = gemini-3.5-flash
 */
const V85={ABA_RELATORIOS_IA:'Relatorios_IA',MODELO_PADRAO:'gemini-3.5-flash'};

function configurarV85(){
  configurarV84();
  atualizarPerfilIgrejasV85_();
  configurarRelatoriosIAV85_();
}

function atualizarPerfilIgrejasV85_(){
  const sh=SpreadsheetApp.getActive().getSheetByName(V84.ABA_PERFIL_IGREJAS);
  if(!sh)throw new Error('Execute configurarV84().');
  let headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  ['primeiro_anciao_diretor','contato_primeiro_anciao_diretor'].forEach(nome=>{
    if(headers.indexOf(nome)<0){sh.insertColumnAfter(sh.getLastColumn());sh.getRange(1,sh.getLastColumn()).setValue(nome);headers.push(nome);}
  });
  formatarV83_(sh,sh.getLastColumn());
}

function configurarRelatoriosIAV85_(){
  const ss=SpreadsheetApp.getActive();let sh=ss.getSheetByName(V85.ABA_RELATORIOS_IA);
  if(!sh)sh=ss.insertSheet(V85.ABA_RELATORIOS_IA);
  if(sh.getLastRow()===0){const headers=['id','igreja','ano','data_hora','usuario','modelo','resultado_geral','relatorio'];sh.getRange(1,1,1,headers.length).setValues([headers]);formatarV83_(sh,headers.length);}
}

function salvarPerfilIgrejaV85(p){
  const sh=SpreadsheetApp.getActive().getSheetByName(V84.ABA_PERFIL_IGREJAS);
  if(!sh)throw new Error('Execute configurarV85().');
  const headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  const finder=sh.getRange('A:A').createTextFinder(String(p.igreja)).matchEntireCell(true).findNext();
  const row=finder?finder.getRow():sh.getLastRow()+1,atual={};
  if(finder)headers.forEach((h,i)=>atual[h]=sh.getRange(row,i+1).getValue());
  const obj={...atual,igreja:p.igreja,quantidade_anciaos:Number(p.quantidade_anciaos)||0,quantidade_familias:Number(p.quantidade_familias)||0,pastor_responsavel:p.pastor_responsavel||'',primeiro_anciao_diretor:p.primeiro_anciao_diretor||'',contato_primeiro_anciao_diretor:p.contato_primeiro_anciao_diretor||'',telefone:p.telefone||'',endereco:p.endereco||'',email:p.email||'',observacoes:p.observacoes||'',ultima_atualizacao:new Date(),atualizado_por:p.usuario||''};
  sh.getRange(row,1,1,headers.length).setValues([headers.map(h=>obj[h]??'')]);
  return {ok:true,row};
}

function gerarRelatorioIAV85(igreja,ano,usuario){
  if(!igreja||igreja==='Todas')throw new Error('Selecione uma igreja específica.');
  const props=PropertiesService.getScriptProperties(),apiKey=props.getProperty('GEMINI_API_KEY');
  if(!apiKey)throw new Error('A propriedade GEMINI_API_KEY ainda não foi configurada.');
  const model=props.getProperty('GEMINI_MODEL')||V85.MODELO_PADRAO;
  const dados=listarDadosV84().filter(r=>String(r.igreja)===String(igreja)&&String(r.ano)===String(ano));
  if(!dados.length)throw new Error('Não há dados cadastrados para esta igreja e ano.');
  const perfil=listarPerfisIgrejasV84().find(p=>String(p.igreja)===String(igreja))||{};
  const membros=listarEstatisticasIgrejasV83().find(s=>String(s.igreja)===String(igreja))||{};
  const evidencias=listarEvidenciasV83(igreja);
  const resumo=prepararResumoIAV85_(igreja,ano,dados,perfil,membros,evidencias);
  const prompt=montarPromptIAV85_(resumo);
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const payload={system_instruction:{parts:[{text:'Você é um consultor estratégico pastoral adventista, experiente em administração eclesiástica, missão, discipulado, liderança, novas gerações e cuidado relacional. Produza análises responsáveis, construtivas, bíblicas e acionáveis. Não invente dados; sinalize lacunas.'}]},contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:3500}};
  const response=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',headers:{'x-goog-api-key':apiKey},payload:JSON.stringify(payload),muteHttpExceptions:true});
  const status=response.getResponseCode(),parsed=JSON.parse(response.getContentText()||'{}');
  if(status<200||status>=300)throw new Error(`Falha na API de IA (${status}): ${parsed.error?.message||'resposta inválida'}`);
  const report=(parsed.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||'').join('\n').trim();
  if(!report)throw new Error('A IA não retornou texto.');
  SpreadsheetApp.getActive().getSheetByName(V85.ABA_RELATORIOS_IA).appendRow([Utilities.getUuid(),igreja,ano,new Date(),usuario||'',model,resumo.resultadoGeral,report]);
  return {report,model,resultadoGeral:resumo.resultadoGeral};
}

function prepararResumoIAV85_(igreja,ano,dados,perfil,membros,evidencias){
  const meta=dados.reduce((s,r)=>s+Number(r.meta||0),0),alc=dados.reduce((s,r)=>s+Number(r.alcancado||0),0),resultadoGeral=meta?Math.round(alc/meta*100):0,areas={};
  dados.forEach(r=>{if(!areas[r.area])areas[r.area]={meta:0,alcancado:0,criterios:[]};areas[r.area].meta+=Number(r.meta||0);areas[r.area].alcancado+=Number(r.alcancado||0);areas[r.area].criterios.push({codigo:r.codigo_requisito,titulo:r.titulo,meta:Number(r.meta||0),alcancado:Number(r.alcancado||0),percentual:Number(r.meta)>0?Math.round(Number(r.alcancado)/Number(r.meta)*100):0,plano_acao:r.plano_acao||'',responsavel:r.responsavel||'',data_inicial:r.data_inicial||'',voto:r.voto||'',material:r.material||''});});
  Object.keys(areas).forEach(a=>areas[a].percentual=areas[a].meta?Math.round(areas[a].alcancado/areas[a].meta*100):0);
  return{igreja,ano,resultadoGeral,metaTotal:meta,alcancadoTotal:alc,membros:{total:Number(membros.total_membros||0),frequentes:Number(membros.membros_frequentes||0),naoFrequentes:Number(membros.membros_nao_frequentes||0),aTransferir:Number(membros.membros_a_transferir||0),aResgatar:Number(membros.membros_a_resgatar||0)},perfil:{quantidadeAnciaos:Number(perfil.quantidade_anciaos||0),quantidadeFamilias:Number(perfil.quantidade_familias||0),pastor:perfil.pastor_responsavel||'',primeiroAnciaoDiretor:perfil.primeiro_anciao_diretor||'',telefoneRepresentante:perfil.contato_primeiro_anciao_diretor||'',endereco:perfil.endereco||'',observacoes:perfil.observacoes||''},areas,evidenciasQuantidade:evidencias.length};
}

function montarPromptIAV85_(resumo){
  return `Elabore um RELATÓRIO ESTRATÉGICO COMPLETO para a igreja abaixo.

DADOS DISPONÍVEIS:
${JSON.stringify(resumo,null,2)}

Use somente os dados fornecidos e sinalize lacunas. Analise profundamente:
- dimensão administrativa;
- dimensão missiológica;
- dimensão teológica e espiritual;
- dimensão relacional.

Inclua:
1. Resumo executivo.
2. Leitura dos indicadores.
3. Pontos fortes e pontos fracos.
4. Matriz SWOT.
5. Principais ameaças ao crescimento e ao alcance das metas.
6. Oportunidades.
7. Critérios mais críticos e razões.
8. Estratégias concretas para 30, 60, 90 e 180 dias.
9. Recomendações específicas para pastor, primeiro ancião/diretor, líderes e membros.
10. Indicadores e rotina mensal de acompanhamento.
11. Ações para não frequentes, a transferir e a resgatar.
12. Quando os resultados forem altos, valorize e parabenize a liderança.
13. Quando forem baixos, use tom encorajador e não condenatório.
14. Conclusão pastoral e breve texto bíblico pertinente, sem inventar citação.

FORMATO MARKDOWN:
# Relatório Estratégico — [Igreja]
## Resumo executivo
## Leitura dos indicadores
## Análise administrativa
## Análise missiológica
## Análise teológica e espiritual
## Análise relacional
## Matriz SWOT
## Pontos prioritários de melhoria
## Plano de ação — 30, 60, 90 e 180 dias
## Responsabilidades por perfil de liderança
## Indicadores de acompanhamento
## Reconhecimento e encorajamento
## Conclusão pastoral`;
}
