# Prioridades Estratégicas | DSA — Atualização v1.0.1

Pacote de atualização baseado nos arquivos fornecidos pelo usuário e na especificação “Ideias para Correções e Atualizações v1.0.1”.

## Antes de implantar
1. Faça backup da Planilha Google e do projeto Apps Script atual.
2. No Apps Script, adicione/substitua os arquivos `.gs` deste pacote.
3. Execute **configurarV101() apenas uma vez**. A rotina é de migração e não limpa os dados existentes.
4. Faça uma **Nova implantação** do Aplicativo da Web e copie a nova URL `/exec`.
5. Atualize `APPS_SCRIPT_URL` em `config.js` se a URL tiver mudado.
6. No GitHub/site, envie os arquivos web e a pasta `assets`. **Mantenha o `styles.css` atual do seu repositório**, pois ele não estava entre os arquivos fornecidos; `v1.0.1.css` é apenas um complemento.
7. Faça recarga forçada (Ctrl+F5) ou feche/reabra o PWA para o novo service worker `prioridades-v1.0.1` assumir.

## O que muda
- Prioridades: novo pictograma combinado, sem seta; textos do detalhamento maiores; botão “Salvar”.
- Planner: persistência no Google Sheets, individual por igreja/ano e exclusão protegida por senha.
- Linha do Tempo: somente checklist da igreja/ano selecionados.
- Evidências: URL de imagem do Drive reconstruída por `file_id`, agrupamento por prioridade, edição e exclusão com senha.
- Relatórios: histórico por igreja/ano, visualizar, PDF, WhatsApp e editar; lista de dificuldades; texto completo exibido.
- WhatsApp: resumo das quatro prioridades + resultado geral + alertas por requisito.
- Requisitos: `Todas` altera padrão global; igreja específica grava meta/ativo em `Requisitos_Igrejas`.
- Minha Igreja: anciãos, famílias, UAPGs e checklist de oficiais; telefone e pastor removidos da interface.
- Desenvolvedor: página exclusiva, foto de perfil no Drive, funções, status, módulos, abrangência e proteção por senha.
- Campo MOPa: aba `Unidades_Campo` com as 46 unidades informadas.

## Observação importante
A especificação cita acesso de “Coordenador do Polo”, porém não fornece a composição de cada polo. A v1.0.1 cria as colunas `polo` e `igrejas` para configuração, sem inventar quais igrejas pertencem a cada polo.
