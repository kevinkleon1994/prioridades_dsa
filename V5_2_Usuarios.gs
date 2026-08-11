/**
 * V5.2 - Usuários e permissões
 * Adicione este arquivo ao mesmo projeto Apps Script.
 * Execute configurarV52() UMA ÚNICA VEZ.
 */
const V52 = {
  ABA_USUARIOS: 'Usuarios'
};

function configurarV52() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(V52.ABA_USUARIOS);
  if (!sh) sh = ss.insertSheet(V52.ABA_USUARIOS);

  sh.clear();
  const headers = ['id','nome','funcao','area_atuacao','login','senha','ativo','ultima_atualizacao','atualizado_por'];
  sh.getRange(1,1,1,headers.length).setValues([headers]);

  sh.getRange(2,1,2,headers.length).setValues([
    ['USR-KEVIN','Kevin Fernandes','Pastor Distrital','Castelo de Sonhos','kevin.fernandes@adventistas.org','2515',true,new Date(),'configurarV52'],
    ['USR-ADMIN','Administrador Master','Administrador da Missão','Todas','admin','1844',true,new Date(),'configurarV52']
  ]);

  sh.setFrozenRows(1);
  sh.getRange(1,1,1,headers.length)
    .setFontWeight('bold')
    .setBackground('#102333')
    .setFontColor('#ffffff');
  sh.autoResizeColumns(1,headers.length);
}

function listarUsuariosV52() {
  const sh = SpreadsheetApp.getActive().getSheetByName(V52.ABA_USUARIOS);
  if (!sh) throw new Error('Execute configurarV52().');
  const values = sh.getDataRange().getDisplayValues();
  const headers = values.shift();
  return values.filter(r=>r[0]).map(r=>{
    const o={};
    headers.forEach((h,i)=>o[h]=r[i]);
    o.ativo=String(o.ativo).toLowerCase()!=='false';
    return o;
  });
}

function autenticarV52(login, senha) {
  const usuarios = listarUsuariosV52();
  const user = usuarios.find(u =>
    String(u.login).trim().toLowerCase() === String(login).trim().toLowerCase() &&
    String(u.senha) === String(senha) &&
    u.ativo === true
  );
  if (!user) return null;
  delete user.senha;
  return user;
}

function salvarUsuarioV52(p) {
  const sh = SpreadsheetApp.getActive().getSheetByName(V52.ABA_USUARIOS);
  if (!sh) throw new Error('A aba Usuarios não existe.');
  ['id','nome','funcao','area_atuacao','login','senha'].forEach(c=>{
    if(!String(p[c]||'').trim()) throw new Error(`Campo obrigatório: ${c}`);
  });

  const finder = sh.getRange('A:A').createTextFinder(String(p.id)).matchEntireCell(true).findNext();
  const row = finder ? finder.getRow() : sh.getLastRow()+1;
  sh.getRange(row,1,1,9).setValues([[
    p.id,p.nome,p.funcao,p.area_atuacao,p.login,p.senha,
    String(p.ativo).toLowerCase()!=='false',
    new Date(),
    p.usuario_admin||''
  ]]);
  return {ok:true,id:p.id,row};
}

function excluirUsuarioV52(id) {
  if (id === 'USR-ADMIN') throw new Error('O administrador master não pode ser excluído.');
  const sh = SpreadsheetApp.getActive().getSheetByName(V52.ABA_USUARIOS);
  const finder = sh.getRange('A:A').createTextFinder(String(id)).matchEntireCell(true).findNext();
  if (!finder) return {ok:false,error:'Usuário não encontrado.'};
  sh.deleteRow(finder.getRow());
  return {ok:true};
}

/*
INTEGRAÇÃO NO Code.gs

Dentro do doGet(e):

if (action === 'login') {
  payload = {
    ok: true,
    user: autenticarV52(e.parameter.email, e.parameter.codigo)
  };
} else if (action === 'listUsers') {
  payload = {
    ok: true,
    data: listarUsuariosV52()
  };
}

Dentro do doPost(e), antes da ação save existente:

if (p.action === 'saveUser') {
  return jsonResponse({
    ok: true,
    data: salvarUsuarioV52(p)
  });
}

if (p.action === 'deleteUser') {
  return jsonResponse({
    ok: true,
    data: excluirUsuarioV52(p.id)
  });
}
*/
