# Initial-build helper only. NEVER apply over a prepared/user-styled workbook.
"""Refine the new presentation views after initial layout installation.
Applies only to derived presentation tabs; state schemas remain unchanged.
Generate requests; verify the independent workbook before applying them.
"""
import sys
import json
R=[]
def rng(s,a,b,c,d):return dict(sheetId=s,startRowIndex=a,endRowIndex=b,startColumnIndex=c,endColumnIndex=d)
def write(s,r,c,v):R.append({'updateCells':{'start':dict(sheetId=s,rowIndex=r,columnIndex=c),'rows':[{'values':[{'userEnteredValue':{'formulaValue' if x.startswith('=') else 'stringValue':x}} for x in v]}],'fields':'userEnteredValue'}})
def merge(s,a,b,c,d):R.append({'mergeCells':{'range':rng(s,a,b,c,d),'mergeType':'MERGE_ALL'}})
def fmt(s,a,b,c,d,f):R.append({'repeatCell':{'range':rng(s,a,b,c,d),'cell':{'userEnteredFormat':f},'fields':','.join('userEnteredFormat.'+k for k in f)}})
def height(s,a,b,v):R.append({'updateDimensionProperties':{'range':dict(sheetId=s,dimension='ROWS',startIndex=a,endIndex=b),'properties':{'pixelSize':v},'fields':'pixelSize'}})
def width(s,a,v):R.append({'updateDimensionProperties':{'range':dict(sheetId=s,dimension='COLUMNS',startIndex=a,endIndex=a+1),'properties':{'pixelSize':v},'fields':'pixelSize'}})
navy={'red':.11,'green':.18,'blue':.27};teal={'red':.17,'green':.43,'blue':.44};muted={'red':.43,'green':.48,'blue':.53};white={'red':1,'green':1,'blue':1};canvas={'red':.973,'green':.980,'blue':.985};line={'red':.88,'green':.91,'blue':.93};sid=3001
R.append({'updateSheetProperties':{'properties':{'sheetId':sid,'gridProperties':{'columnCount':18}},'fields':'gridProperties.columnCount'}})
R.append({'unmergeCells':{'range':rng(sid,0,40,0,12)}})
R.append({'updateCells':{'range':rng(sid,0,40,0,18),'rows':[],'fields':'userEnteredValue,userEnteredFormat'}})
for i in range(3,-1,-1):R.append({'deleteConditionalFormatRule':{'sheetId':sid,'index':i}})
fmt(sid,0,32,0,13,{'backgroundColor':canvas,'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':navy},'verticalAlignment':'MIDDLE','wrapStrategy':'WRAP','horizontalAlignment':'LEFT'})
for c,w in enumerate([24,142,178,24,142,178,24,142,178,24,142,178,24,200,120,120,120,120]):width(sid,c,w)
height(sid,0,32,28);height(sid,0,1,18);height(sid,1,2,44);height(sid,2,3,28);height(sid,3,4,18)
merge(sid,1,2,1,12);write(sid,1,1,['Recurring Operations']);fmt(sid,1,2,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':24,'bold':True,'foregroundColor':navy}})
merge(sid,2,3,1,12);write(sid,2,1,['Task tracking & escalation · One update. Clear ownership. Timely follow-up.']);fmt(sid,2,3,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':12,'foregroundColor':muted}})
write(sid,1,15,['=DATEVALUE(LEFT(Demo_Control!B2,10))+TIMEVALUE(MID(Demo_Control!B2,12,8))+IF(RIGHT(Demo_Control!B2,1)="Z",TIME(5,30,0),0)'])
cards=[(1,3,'Active tasks','=COUNTIF(Task_Master!J2:J1000,TRUE)','Recurring definitions'),(4,6,'Pending cycles','=COUNTIF(Employee_Queue!I2:I1000,"Pending")','Includes upcoming cycles'),(7,9,'Completed cycles','=COUNTIF(Employee_Queue!I2:I1000,"Completed")','Proof recorded once'),(10,12,'Overdue cycles','=COUNTIF(Manager_Dashboard!E2:E1000,"Overdue")','Needs follow-up')]
for a,b,label,formula,desc in cards:
 for row in (4,5,6):merge(sid,row,row+1,a,b)
 write(sid,4,a,[label]);write(sid,5,a,[formula]);write(sid,6,a,[desc]);fmt(sid,4,7,a,b,{'backgroundColor':white});fmt(sid,4,5,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}});fmt(sid,5,6,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':28,'bold':True,'foregroundColor':teal},'numberFormat':{'type':'NUMBER','pattern':'0'}});fmt(sid,6,7,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':10,'foregroundColor':muted}})
 R.append({'updateBorders':{'range':rng(sid,4,7,a,b),'top':{'style':'SOLID_MEDIUM','color':teal},'bottom':{'style':'SOLID','color':line}}})
height(sid,4,5,30);height(sid,5,6,46);height(sid,6,7,28);height(sid,7,8,18)
merge(sid,8,9,1,7);write(sid,8,1,['="Manager captures: "&COUNTIFS(Alert_Log!C2:C1000,"manager",Alert_Log!I2:I1000,"SENT",Alert_Log!L2:L1000,"MAILPIT")&"     ·     Leadership captures: "&COUNTIFS(Alert_Log!C2:C1000,"leadership",Alert_Log!I2:I1000,"SENT",Alert_Log!L2:L1000,"MAILPIT")']);fmt(sid,8,9,1,7,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})
merge(sid,8,9,7,12);write(sid,8,7,['="TEST MODE · "&TEXT($P$2,"ddd d mmm · HH:mm")&" · "&Demo_Control!B4']);fmt(sid,8,9,7,12,{'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':teal},'horizontalAlignment':'RIGHT'})
height(sid,9,10,20);merge(sid,10,11,1,12);write(sid,10,1,['Recurring work at a glance']);fmt(sid,10,11,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':15,'bold':True,'foregroundColor':navy}});height(sid,10,11,34)
cols=[(1,2,'Employee'),(2,6,'Task & responsibility'),(6,8,'Frequency'),(8,10,'Due'),(10,11,'Status'),(11,12,'Proof')]
for a,b,t in cols:
 if b-a>1:merge(sid,11,12,a,b)
 write(sid,11,a,[t]);fmt(sid,11,12,a,b,{'backgroundColor':{'red':.91,'green':.94,'blue':.95},'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':navy}})
height(sid,11,12,36)
for row in range(13,17):
 taskrow=row-11
 chosen=f'=IFERROR(INDEX(SORT(FILTER({{Employee_Queue!A$2:A$1000,Employee_Queue!G$2:G$1000}},Employee_Queue!B$2:B$1000=Task_Master!A{taskrow},Employee_Queue!I$2:I$1000="Pending"),2,TRUE),1,1),IFERROR(INDEX(SORT(FILTER({{Employee_Queue!A$2:A$1000,Employee_Queue!G$2:G$1000}},Employee_Queue!B$2:B$1000=Task_Master!A{taskrow}),2,FALSE),1,1),""))'
 write(sid,row-1,13,[chosen]);due=f'XLOOKUP($N{row},Employee_Queue!A$2:A$1000,Employee_Queue!H$2:H$1000,"")';state=f'XLOOKUP($N{row},Employee_Queue!A$2:A$1000,Employee_Queue!I$2:I$1000,"")';numeric=f'(DATEVALUE(LEFT({due},10))+TIMEVALUE(MID({due},12,8)))'
 vals=[f'=Task_Master!D{taskrow}',f'=Task_Master!B{taskrow}&CHAR(10)&Task_Master!C{taskrow}',f'=IF(Task_Master!F{taskrow}="daily","Each workday","Every "&Task_Master!F{taskrow}&" days")',f'=IF($N{row}="","Awaiting cycle",TEXT({numeric},"ddd d mmm · HH:mm"))',f'=IF($N{row}="","Awaiting cycle",IF({state}="Completed","Completed",IF({numeric}<$P$2,"Overdue",IF(INT({numeric})>INT($P$2),"Upcoming","Pending"))))',f'=IF(Task_Master!I{taskrow}="report","Daily report","Ticket ID")']
 for (a,b,_),val in zip(cols,vals):
  if b-a>1:merge(sid,row-1,row,a,b)
  write(sid,row-1,a,[val]);fmt(sid,row-1,row,a,b,{'backgroundColor':white,'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':navy}})
 R.append({'updateBorders':{'range':rng(sid,row-1,row,1,12),'bottom':{'style':'SOLID','color':line}}})
height(sid,12,16,54);height(sid,16,17,18)
merge(sid,17,18,1,12);write(sid,17,1,['Proof, completion time, history and the next cycle update automatically from one submission.']);fmt(sid,17,18,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})
for a,b,title,desc in [(1,6,'Employee action','Ops Tasks → My tasks → Submit completion'),(7,12,'Manager action','Ops Tasks → Manager review → Acknowledge alert')]:
 merge(sid,19,20,a,b);merge(sid,20,21,a,b);fmt(sid,19,21,a,b,{'backgroundColor':white});write(sid,19,a,[title]);write(sid,20,a,[desc]);fmt(sid,19,20,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':12,'bold':True,'foregroundColor':navy}});fmt(sid,20,21,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':teal}})
height(sid,19,21,32)
merge(sid,22,23,1,12);write(sid,22,1,['Acknowledgement means the manager reviewed the issue. It does not complete the employee task.']);fmt(sid,22,23,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':11,'foregroundColor':muted}})
for a,b,gid,label in [(1,4,3004,'Activity history →'),(4,7,3005,'Notification evidence →'),(7,10,948034014,'Task definitions →')]:
 merge(sid,24,25,a,b);write(sid,24,a,[f'=HYPERLINK("#gid={gid}","{label}")']);fmt(sid,24,25,a,b,{'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':teal}})
merge(sid,26,27,1,12);write(sid,26,1,['Fictional operations data · Employee A uses an approved Google login; B/C/D actions are labelled SIMULATED.']);fmt(sid,26,27,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':10,'foregroundColor':muted}})
merge(sid,27,28,1,12);write(sid,27,1,['Business time is simulated. Execution and SMTP capture timestamps are real.']);fmt(sid,27,28,1,12,{'textFormat':{'fontFamily':'Arial','fontSize':10,'foregroundColor':muted}})
R.append({'updateDimensionProperties':{'range':dict(sheetId=sid,dimension='COLUMNS',startIndex=0,endIndex=18),'properties':{'hiddenByUser':False},'fields':'hiddenByUser'}})
R.append({'updateDimensionProperties':{'range':dict(sheetId=sid,dimension='COLUMNS',startIndex=13,endIndex=18),'properties':{'hiddenByUser':True},'fields':'hiddenByUser'}})
for text,bg,fg in [('Completed',{'red':.90,'green':.96,'blue':.94},teal),('Overdue',{'red':1,'green':.93,'blue':.92},{'red':.65,'green':.26,'blue':.23}),('Pending',{'red':1,'green':.97,'blue':.89},{'red':.53,'green':.40,'blue':.17}),('Upcoming',{'red':.92,'green':.95,'blue':.98},muted)]:R.append({'addConditionalFormatRule':{'index':0,'rule':{'ranges':[rng(sid,12,16,10,11)],'booleanRule':{'condition':{'type':'TEXT_EQ','values':[{'userEnteredValue':text}]},'format':{'backgroundColor':bg,'textFormat':{'foregroundColor':fg,'bold':True}}}}}})
# Shorter operational views; no repeating lines on unused rows.
for s,w in [(3002,[120,220,165,100,280,150,195,210]),(3003,[120,220,165,100,145,120,120,205]),(3004,[105,120,175,175,205,150,175,190]),(3005,[110,180,110,110,110,190,225,255])]:
 for c,v in enumerate(w):width(s,c,v)
 fmt(s,4,5,0,8,{'backgroundColor':{'red':.91,'green':.94,'blue':.95},'textFormat':{'fontFamily':'Arial','fontSize':11,'bold':True,'foregroundColor':navy}})
 R.append({'updateBorders':{'range':rng(s,5,30,0,8),'innerHorizontal':{'style':'NONE'}}})
 height(s,5,20,46)
R.append({'findReplace':{'find':"'Operations Overview'!K2",'replacement':"'Operations Overview'!P2",'sheetId':3002,'includeFormulas':True}})
json.dump(R,open(sys.argv[1] if len(sys.argv)>1 else '/tmp/ops-presentation-refine-requests.json','w'))
print('Prepared',len(R),'presentation-only requests.')
