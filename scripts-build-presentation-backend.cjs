// Compile the same QA backend plus isolated presentation identity storage.
const fs=require('node:fs'),cp=require('node:child_process'),os=require('node:os'),path=require('node:path');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ops-presentation-build-'));
try{
 const temporary=path.join(dir,'base.gs');
 cp.execFileSync(process.execPath,['scripts-build-qa-backend.cjs',temporary]);
 let source=fs.readFileSync(temporary,'utf8').replace(/\nconst QA_SOURCE_DIGEST_=[^\n]+;\n$/,'\n');
 const wrappers={readState_:'presentationReadState_',qaPersist_:'presentationPersist_',qaUserOperation_:'presentationUserOperation_',qaSpreadsheet_:'presentationSpreadsheet_',qaSetMode_:'presentationSetMode_',qaMode_:'presentationMode_',qaMessage_:'presentationMessage_'};
 for(const [name,base] of Object.entries(wrappers)){
  const declaration='function '+name+'(';
  if(source.split(declaration).length!==2)throw Error('Expected one declaration: '+name);
  source=source.replace(declaration,'function '+base+'(');
 }
 const configure='setValue(e.dummy?e.email:actor)';
 if(!source.includes(configure))throw Error('Role adapter changed');
 source=source.replace(configure,'setValue(e.dummy?e.email:"employee.a@example.invalid")');
 const restore='t.employee,t.email,t.frequency';
 if(!source.includes(restore))throw Error('Snapshot task adapter changed');
 source=source.replace(restore,'t.employee,presentationMap_(t.email,true),t.frequency');
 const admin="HtmlService.createHtmlOutputFromFile('Admin')";
 if(!source.includes(admin))throw Error('Administrator UI adapter changed');
 source=source.replace(admin,'HtmlService.createHtmlOutput(PRESENTATION_ADMIN_HTML_)');
 source+='\nconst PRESENTATION_ADMIN_HTML_='+JSON.stringify(fs.readFileSync('apps-script/Admin.html','utf8'))+';\n';
 source+='\n'+fs.readFileSync('apps-script/Presentation.gs','utf8');
 const digest=require('node:crypto').createHash('sha256').update(source).digest('hex');
 source+='\nconst QA_SOURCE_DIGEST_='+JSON.stringify(digest)+';\n';
 fs.writeFileSync(process.argv[2]||'/tmp/ops-presentation-backend.gs',source);
 process.stdout.write('Presentation backend compiled; shared engine preserved.\n');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
