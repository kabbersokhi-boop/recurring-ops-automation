/* Install only in the independent owner-only presentation backend.
 * Engine rules are unchanged. Sheets contain role aliases; verified Google
 * identities and the alias mapping remain in private backend properties. */
function presentationMap_(value, encode){
  const p=qaProps_(),admin=p.getProperty('QA_ADMIN'),manager=p.getProperty('QA_MANAGER');
  if(!admin||!manager||admin===manager)throw Error('Separate private presentation identities required');
  function visit(v){
    if(typeof v==='string'){
      if(encode){if(v.toLowerCase()===admin.toLowerCase())return 'AUTHENTICATED:EMP-A';if(v.toLowerCase()===manager.toLowerCase())return 'AUTHENTICATED:MANAGER';}
      else{if(v==='AUTHENTICATED:EMP-A'||v==='employee.a@example.invalid')return admin;if(v==='AUTHENTICATED:MANAGER')return manager;}
      return v;
    }
    if(Array.isArray(v))return v.map(visit);
    if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,visit(x)]));
    return v;
  }
  return visit(value);
}
function readState_(){return presentationMap_(presentationReadState_(),false);}
function qaPersist_(s){presentationPersist_(presentationMap_(s,true));}
function qaUserOperation_(p,actor){
  const result=presentationUserOperation_(p,actor);
  // The Google-verified actor is retained privately for this demonstration's
  // audit events. Cells use stable roles, with AUTHENTICATED/SIMULATED mode.
  if(['complete','acknowledge'].includes(p.operation)&&!result.duplicate){
    const key='PRESENTATION_AUDIT_'+Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,p.operation+':'+p.cycleId).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
    qaProps_().setProperty(key,JSON.stringify({operation:p.operation,cycleId:p.cycleId,actor,actualAt:result.actualAt,businessNow:result.businessNow}));
  }
  return presentationMap_(result,true);
}
function qaSpreadsheet_(){
  const p=qaProps_(),id=p.getProperty('QA_SHEET_ID'),forbidden=JSON.parse(p.getProperty('PRESENTATION_FORBIDDEN_SHEETS')||'[]');
  if(forbidden.length<2||forbidden.includes(id))throw Error('Presentation must exclude original and private QA workbooks');
  return presentationSpreadsheet_();
}
function qaSetMode_(mode){if(mode==='GMAIL_TEST')throw Error('Presentation uses Mailpit or dry-run; previously verified Gmail evidence is retained separately');return presentationSetMode_(mode);}
function qaMode_(state){const mode=presentationMode_(state);if(mode==='GMAIL_TEST')throw Error('External sending is disabled in the presentation deployment');return mode;}
function qaMessage_(a){const m=presentationMessage_(a);m.subject=m.subject.replace('[OPS QA]','[OPS DEMO]');m.body=m.body.replace('isolated QA environment','isolated presentation environment').replace('private QA Sheet','presentation Sheet');return m;}
