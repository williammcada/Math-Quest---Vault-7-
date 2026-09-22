// Gameplay fixtures act as logged-in clients. Security tests import the real
// QuestSession directly and intentionally send missing/wrong credentials.
import {QuestSession as Server} from '../src/worker.js';
export {balancedGateLoads} from '../src/worker.js';
const credentials=new Map();
export class QuestSession extends Server{
 async fetch(request){
   await this.ready;
   const url=new URL(request.url),headers=new Headers(request.headers);
   const input=request.method==='POST'?await request.clone().json().catch(()=>({})):{};
   const teacher=input.teacherKey||url.searchParams.get('teacherKey');
   const id=input.deviceId||url.searchParams.get('deviceId');
   if(teacher)headers.set('authorization','Bearer '+teacher);
   else if(id){const key=this.state.students?.[id]?.credential||credentials.get(id)||crypto.randomUUID();credentials.set(id,key);headers.set('authorization','Bearer '+key);}
   return super.fetch(new Request(request,{headers}));
 }
}
