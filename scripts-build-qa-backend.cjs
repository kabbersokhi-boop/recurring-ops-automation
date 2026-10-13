// Reuse the existing engine and Sheet adapter in the private standalone project.
// Exclude the original setup, UI, MailApp path and fallback web endpoint.
const fs=require('node:fs');
const source=fs.readFileSync('apps-script/Code.gs','utf8');
const names=['sheetRows','cellDay','cellTime','readState','writeState','locked'];
const starts=[...source.matchAll(/^function (\w+)\(/gm)];
const adapter=names.map(name=>{
 const i=starts.findIndex(m=>m[1]===name);if(i<0)throw Error('Missing adapter '+name);
 return source.slice(starts[i].index,starts[i+1]?.index||source.length);
}).join('\n');
let output=[fs.readFileSync('apps-script/TaskManager.gs','utf8'),source.slice(0,source.indexOf('function setupPrototype(')),adapter,
 'function opsSpreadsheet(){return qaSpreadsheet_();}\nfunction nowIso(){return qaBusinessNow_();}',
 fs.readFileSync('apps-script/QA.gs','utf8'),fs.readFileSync('apps-script/QABackend.gs','utf8')].join('\n');
// Apps Script hides server functions ending in underscore from google.script.run.
// Only guarded admin entry points and doPost/doGet remain public functions.
for(const name of [...names,'opsSpreadsheet','nowIso'])output=output.replace(new RegExp('\\b'+name+'\\b','g'),name+'_');
const digest=require('node:crypto').createHash('sha256').update(output).digest('hex');
output+='\nconst QA_SOURCE_DIGEST_='+JSON.stringify(digest)+';\n';
fs.writeFileSync(process.argv[2]||'/tmp/ops-qa-backend-source.gs',output);
