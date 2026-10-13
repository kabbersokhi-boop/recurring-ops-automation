# Initial-build helper only. NEVER apply over a prepared/user-styled workbook.
"""Generate native Sheets formatting requests; no account or endpoint data.

Usage: python scripts-presentation-layout.py metadata.json > requests.json
Apply once to a verified independent presentation workbook, then inspect its
actual native rendering. Existing state column positions are preserved.
"""
import json, sys

meta = json.load(open(sys.argv[1]))
requests = []
navy = {'red': .09, 'green': .16, 'blue': .25}
teal = {'red': .13, 'green': .42, 'blue': .43}
muted = {'red': .38, 'green': .44, 'blue': .50}
white = {'red': 1, 'green': 1, 'blue': 1}
pale = {'red': .95, 'green': .97, 'blue': .97}
line = {'red': .87, 'green': .90, 'blue': .92}

def grid(sid, r0, r1, c0, c1):
    return dict(sheetId=sid, startRowIndex=r0, endRowIndex=r1,
                startColumnIndex=c0, endColumnIndex=c1)

def fmt(sid, r0, r1, c0, c1, value):
    requests.append({'repeatCell': {'range': grid(sid,r0,r1,c0,c1),
        'cell': {'userEnteredFormat': value},
        'fields': ','.join('userEnteredFormat.'+k for k in value)}})

def write(sid, row, col, values):
    requests.append({'updateCells': {'start': dict(sheetId=sid,rowIndex=row,columnIndex=col),
        'rows': [{'values': [{'userEnteredValue':
            {'formulaValue' if isinstance(v,str) and v.startswith('=') else 'stringValue': str(v)}}
            for v in values]}], 'fields': 'userEnteredValue'}})

def merge(sid,r0,r1,c0,c1):
    requests.append({'mergeCells': {'range':grid(sid,r0,r1,c0,c1),'mergeType':'MERGE_ALL'}})

def widths(sid, values):
    for c,size in enumerate(values):
        requests.append({'updateDimensionProperties': {'range': dict(sheetId=sid,
            dimension='COLUMNS',startIndex=c,endIndex=c+1),
            'properties': {'pixelSize':size},'fields':'pixelSize'}})

def height(sid,r0,r1,size):
    requests.append({'updateDimensionProperties': {'range':dict(sheetId=sid,
        dimension='ROWS',startIndex=r0,endIndex=r1),
        'properties':{'pixelSize':size},'fields':'pixelSize'}})

def status(sid,col,text,bg,fg):
    requests.append({'addConditionalFormatRule': {'index':0,'rule': {
        'ranges':[grid(sid,5,500,col,col+1)],'booleanRule':{
        'condition':{'type':'TEXT_EQ','values':[{'userEnteredValue':text}]},
        'format':{'backgroundColor':bg,'textFormat':{'foregroundColor':fg,'bold':True}}}}}})

def table(sid,headers,width):
    fmt(sid,0,80,0,len(headers),{'textFormat':{'fontFamily':'Arial','fontSize':11,
        'foregroundColor':navy},'verticalAlignment':'MIDDLE','wrapStrategy':'WRAP'})
    fmt(sid,4,5,0,len(headers),{'backgroundColor':navy,
        'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':white}})
    write(sid,4,0,headers);widths(sid,width);height(sid,0,80,36);height(sid,4,5,38)
    requests.append({'updateBorders': {'range':grid(sid,5,30,0,len(headers)),
        'innerHorizontal': {'style':'SOLID','color':line}}})

def heading(sid,title,subtitle,n=8):
    merge(sid,0,2,0,n);write(sid,0,0,[title]);height(sid,0,2,30)
    fmt(sid,0,2,0,n,{'textFormat':{'fontFamily':'Arial','fontSize':22,'bold':True,
        'foregroundColor':navy},'verticalAlignment':'MIDDLE'})
    merge(sid,2,3,0,n);write(sid,2,0,[subtitle]);height(sid,2,3,30)
    fmt(sid,2,3,0,n,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})

new = [(3001,'Operations Overview'),(3002,'Employee Work'),(3003,'Manager Review'),
       (3004,'Activity History'),(3005,'Notification Evidence')]
for index,(sid,title) in enumerate(new):
    requests.append({'addSheet':{'properties': {'sheetId':sid,'title':title,'index':index,
        'gridProperties':{'rowCount':500,'columnCount':12,'hideGridlines':True},
        'tabColorStyle':{'rgbColor':teal if index==0 else navy}}}})
    requests.append({'addProtectedRange':{'protectedRange':{'range':{'sheetId':sid},
        'description':'System-maintained presentation view; update through authorized sidebars',
        'warningOnly':False}}})

# Remove older row-wide colour rules; preserve every state header and index.
for sheet in meta['sheets']:
    prop=sheet['properties'];sid=prop['sheetId'];name=prop['title']
    for index in reversed(range(len(sheet.get('conditionalFormats',[])))):
        requests.append({'deleteConditionalFormatRule':{'sheetId':sid,'index':index}})
    requests.append({'updateSheetProperties':{'properties':{'sheetId':sid,
        'hidden':name in ['Employee_Queue','Task_History','Manager_Dashboard','Alert_Log','Settings'],
        'gridProperties':{'hideGridlines':True,'frozenColumnCount':0,'frozenRowCount':0}},
        'fields':'hidden,gridProperties.hideGridlines,gridProperties.frozenColumnCount,gridProperties.frozenRowCount'}})
    fmt(sid,0,30,0,26,{'backgroundColor':white,'textFormat':{'fontFamily':'Arial',
        'fontSize':11,'foregroundColor':navy},'verticalAlignment':'MIDDLE','wrapStrategy':'WRAP'})
    fmt(sid,0,1,0,11 if name=='Task_Master' else 2 if name in ['Settings','Demo_Control'] else 24,
        {'backgroundColor':navy,'textFormat':{'fontFamily':'Arial','fontSize':11,
            'bold':True,'foregroundColor':white}})
    height(sid,0,30,34);height(sid,0,1,38)

overview=3001
widths(overview,[135,255,100,165,120,175,245,200,100,100,100,100])
heading(overview,'Recurring Operations — Task Tracking & Escalation',
        'DEMONSTRATION DATA · TEST MODE · Four fictional employees · Safe SMTP capture',7)
fmt(overview,3,31,0,7,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':navy},
    'verticalAlignment':'MIDDLE','wrapStrategy':'WRAP'});height(overview,3,31,32)
kpis=[(4,0,2,'Active task definitions','=COUNTIF(Task_Master!J2:J1000,TRUE)'),
      (4,2,4,'Pending cycles','=COUNTIF(Employee_Queue!I2:I1000,"Pending")'),
      (4,4,7,'Completed cycles','=COUNTIF(Employee_Queue!I2:I1000,"Completed")'),
      (7,0,2,'Overdue cycles','=COUNTIF(Manager_Dashboard!E2:E1000,"Overdue")'),
      (7,2,4,'Manager messages captured','=COUNTIFS(Alert_Log!C2:C1000,"manager",Alert_Log!I2:I1000,"SENT",Alert_Log!L2:L1000,"MAILPIT")'),
      (7,4,7,'Leadership messages captured','=COUNTIFS(Alert_Log!C2:C1000,"leadership",Alert_Log!I2:I1000,"SENT",Alert_Log!L2:L1000,"MAILPIT")')]
for row,c0,c1,label,formula in kpis:
    merge(overview,row,row+1,c0,c1);merge(overview,row+1,row+2,c0,c1)
    write(overview,row,c0,[label]);write(overview,row+1,c0,[formula])
    fmt(overview,row,row+2,c0,c1,{'backgroundColor':pale})
    fmt(overview,row,row+1,c0,c1,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})
    fmt(overview,row+1,row+2,c0,c1,{'textFormat':{'fontFamily':'Arial','fontSize':24,'bold':True,'foregroundColor':teal},'numberFormat':{'type':'NUMBER','pattern':'0'}})
    height(overview,row+1,row+2,42)
write(overview,11,0,['Employee','Recurring task','Frequency','Cycle due','Status','Required proof','Next action'])
fmt(overview,11,12,0,7,{'backgroundColor':navy,'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':white}})
height(overview,12,16,48)
write(overview,1,10,['=DATEVALUE(LEFT(Demo_Control!B2,10))+TIMEVALUE(MID(Demo_Control!B2,12,8))+IF(RIGHT(Demo_Control!B2,1)="Z",TIME(5,30,0),0)'])
for row in range(13,17):
    taskrow=row-11
    chosen=f'=IFERROR(INDEX(SORT(FILTER({{Employee_Queue!A$2:A$1000,Employee_Queue!G$2:G$1000}},Employee_Queue!B$2:B$1000=Task_Master!A{taskrow},Employee_Queue!I$2:I$1000="Pending"),2,TRUE),1,1),IFERROR(INDEX(SORT(FILTER({{Employee_Queue!A$2:A$1000,Employee_Queue!G$2:G$1000}},Employee_Queue!B$2:B$1000=Task_Master!A{taskrow}),2,FALSE),1,1),""))'
    write(overview,row-1,7,[chosen])
    due=f'XLOOKUP($H{row},Employee_Queue!A$2:A$1000,Employee_Queue!H$2:H$1000,"")'
    state=f'XLOOKUP($H{row},Employee_Queue!A$2:A$1000,Employee_Queue!I$2:I$1000,"")'
    numeric=f'(DATEVALUE(LEFT({due},10))+TIMEVALUE(MID({due},12,8)))'
    write(overview,row-1,0,[f'=Task_Master!D{taskrow}',f'=Task_Master!B{taskrow}',
        f'=IF(Task_Master!F{taskrow}="daily","Daily",Task_Master!F{taskrow}&" days")',
        f'=IF($H{row}="","Awaiting cycle",TEXT({numeric},"ddd d mmm · HH:mm"))',
        f'=IF($H{row}="","Awaiting cycle",IF({state}="Completed","Completed",IF({numeric}<$K$2,"Overdue",IF(INT({numeric})>INT($K$2),"Upcoming","Pending"))))',
        f'=IF(Task_Master!I{taskrow}="report","Work / pending / blockers","Portal Ticket ID")',
        f'=IF(E{row}="Completed","Recorded in Activity History",IF(E{row}="Upcoming","Available on the due day",IF(A{row}="Employee A","Ops Tasks → My tasks","Labelled administrator simulation")))'])
for row,text in [(18,'ONE UPDATE · Proof, status, timestamp and history are recorded together.'),
                 (20,'EMPLOYEES  ·  Ops Tasks → My tasks → Submit completion'),
                 (21,'MANAGERS  ·  Ops Tasks → Manager review → Acknowledge alert'),
                 (23,'Manager acknowledgement records follow-up. Employee completion resolves the work separately.'),
                 (25,'DEMO CLOCK  ·  Business time is simulated; execution and SMTP capture times are real.'),
                 (27,'EMP-A uses an approved Google login. B / C / D are distinct dummy identities with SIMULATED actions.'),
                 (29,'Read-only review: inspect views and evidence. Authenticated actions require approved editor access.')]:
    merge(overview,row-1,row,0,7);write(overview,row-1,0,[text]);height(overview,row-1,row,34)
    fmt(overview,row-1,row,0,7,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})
write(overview,25,0,['="Business clock: "&TEXT($K$2,"ddd d mmm yyyy · HH:mm")&" Asia/Kolkata  |  Mode: "&Demo_Control!B4'])
merge(overview,25,26,0,7)
requests.append({'updateDimensionProperties':{'range':dict(sheetId=overview,dimension='COLUMNS',startIndex=7,endIndex=12),'properties':{'hiddenByUser':True},'fields':'hiddenByUser'}})

table(3002,['Employee','Task','Due','Status','Completion proof','Source','Next cycle','Cycle ID'],[130,230,170,110,310,165,220,240])
heading(3002,'Employee Work','Inspect your queue here. Submit once through Ops Tasks → My tasks.')
write(3002,5,0,['=IFERROR(FILTER({Employee_Queue!D2:D1000,Employee_Queue!C2:C1000,LEFT(Employee_Queue!H2:H1000,10)&" · "&MID(Employee_Queue!H2:H1000,12,5),IF(Employee_Queue!I2:I1000="Completed","Completed",IF(Employee_Queue!G2:G1000<TEXT(\'Operations Overview\'!K2,"yyyy-mm-dd"),"Overdue",Employee_Queue!I2:I1000)),IF(Employee_Queue!J2:J1000<>"",Employee_Queue!J2:J1000,IF(Employee_Queue!I2:I1000="Completed","Daily report recorded","Submit required proof")),Employee_Queue!S2:S1000,Employee_Queue!Q2:Q1000,Employee_Queue!A2:A1000},Employee_Queue!A2:A1000<>""),"No cycles yet")'])
table(3003,['Employee','Task','Due','Status','Manager review','Resolution','Escalation','Next cycle'],[130,235,170,115,160,140,135,225])
heading(3003,'Manager Review','One view for all four employees. Acknowledgement and task resolution are independent.')
write(3003,5,0,['=IFERROR(FILTER({Manager_Dashboard!C2:C1000,Manager_Dashboard!B2:B1000,LEFT(Manager_Dashboard!D2:D1000,10)&" · "&MID(Manager_Dashboard!D2:D1000,12,5),Manager_Dashboard!E2:E1000,Manager_Dashboard!H2:H1000,Manager_Dashboard!N2:N1000,Manager_Dashboard!M2:M1000,Manager_Dashboard!W2:W1000},Manager_Dashboard!A2:A1000<>""),"No cycles yet")'])
table(3004,['Employee ID','Event','Business timestamp','Actual execution','Proof','Action source','Actor role','Next cycle'],[115,140,220,220,245,170,200,220])
heading(3004,'Activity History','Real recorded events · authenticated roles and administrator simulations are clearly distinguished.')
write(3004,5,0,['=IFERROR(FILTER({Task_History!I2:I1000,Task_History!B2:B1000,Task_History!C2:C1000,Task_History!H2:H1000,IF(Task_History!E2:E1000<>"",Task_History!E2:E1000,IF(Task_History!B2:B1000="Completed","Structured daily report","Manager review")),Task_History!J2:J1000,Task_History!D2:D1000,Task_History!G2:G1000},Task_History!A2:A1000<>""),"No history yet — complete a task or acknowledge an alert")'])
table(3005,['Employee','Task','Level','Transport','Delivery state','Actual capture / receipt','Cycle ID','Reason'],[120,200,115,115,130,235,245,320])
heading(3005,'Notification Evidence','Presentation workbook only. Verified manager/leadership captures are retained in separate private QA; no alerts were triggered here.')
write(3005,5,0,['=IFERROR(FILTER({Alert_Log!E2:E1000,Alert_Log!F2:F1000,Alert_Log!C2:C1000,Alert_Log!L2:L1000,Alert_Log!I2:I1000,Alert_Log!P2:P1000,Alert_Log!B2:B1000,Alert_Log!M2:M1000},Alert_Log!A2:A1000<>""),"No alerts yet")'])

green={'red':.88,'green':.96,'blue':.92};amber={'red':1,'green':.96,'blue':.87};red={'red':.99,'green':.91,'blue':.90};blue={'red':.91,'green':.95,'blue':.98}
for sid,col in [(3002,3),(3003,3)]:
    for text,bg,fg in [('Completed',green,teal),('Pending',amber,navy),('Upcoming',blue,navy),('Overdue',red,{'red':.65,'green':.2,'blue':.15})]:status(sid,col,text,bg,fg)
for text,bg in [('Acknowledged',green),('Late',red),('Pending',amber)]:status(3003,4,text,bg,navy)
status(3003,6,'Leadership',red,navy);status(3005,4,'SENT',green,teal)
status(3004,5,'SIMULATED',amber,navy);status(3004,5,'AUTHENTICATED',green,teal)
for text,bg in [('Completed',green),('Overdue',red),('Pending',amber),('Upcoming',blue)]:
    requests.append({'addConditionalFormatRule':{'index':0,'rule':{'ranges':[grid(overview,12,16,4,5)],'booleanRule':{'condition':{'type':'TEXT_EQ','values':[{'userEnteredValue':text}]},'format':{'backgroundColor':bg,'textFormat':{'foregroundColor':navy,'bold':True}}}}}})

widths(948034014,[100,230,330,125,220,90,135,100,110,85,100]);height(948034014,1,5,54)
for c0,c1 in [(4,5),(6,7),(9,10)]:
    requests.append({'updateDimensionProperties':{'range':dict(sheetId=948034014,dimension='COLUMNS',startIndex=c0,endIndex=c1),'properties':{'hiddenByUser':True},'fields':'hiddenByUser'}})
json.dump(requests,sys.stdout)
