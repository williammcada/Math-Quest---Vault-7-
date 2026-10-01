import {BrawlModel} from './model.js';
import {JOURNEY_BUILD,PROTOCOL,LIMITS} from '../../../public/games/journey/config.js';

const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});

export class BrawlRun {
  constructor(ctx,env){this.ctx=ctx;this.env=env;this.model=null;this.meta=null;this.tickets={};this.sockets=new Map();this.serial=Promise.resolve();this.timer=null;this.lastBroadcast=0;
    this.ready=ctx.blockConcurrencyWhile(async()=>{
      const saved=await ctx.storage.get('run');
      if(saved){this.meta=saved.meta;this.delivered=!!saved.meta.delivered;this.tickets=saved.tickets||{};this.model=new BrawlModel(null,0,saved.state);
        for(const socket of ctx.getWebSockets?.()||[]){const a=socket.deserializeAttachment();if(a?.id)this.sockets.set(socket,a);}
        if(['running','launch','recovery'].includes(this.model.s.phase)){this.model.finish('interrupted','backend_restarted');await this.persist();}
        else{for(const p of Object.values(this.model.s.players)){p.connected=false;p.available=false;}
          for(const a of this.sockets.values()){const p=this.model.s.players[a.id];if(p&&p.epoch===a.epoch){p.connected=true;p.available=true;}}}
        this.schedule();
      }
    });
  }
  enqueue(fn){const p=this.serial.then(async()=>{await this.ready;return fn();});this.serial=p.catch(()=>{});return p;}
  fetch(request){return this.enqueue(()=>this.handle(request));}
  async persist(){if(this.model)await this.ctx.storage.put('run',{meta:this.meta,tickets:this.tickets,state:this.model.s});}
  async handle(request){const path=new URL(request.url).pathname,now=Date.now();
    if(path==='/init'&&request.method==='POST'){
      const data=await request.json();
      if(this.model)return this.model.s.runId===data.runId?json({ok:true}):json({error:'Run already exists'},409);
      this.model=new BrawlModel(data,now);this.meta={resultKey:data.resultKey,roomCode:data.roomCode};
      if(data.paused)this.model.setPause('session',true,now);
      await this.persist();this.schedule();return json({ok:true});
    }
    if(!this.model)return json({error:'Run not found'},404);
    if(path==='/delete'&&request.method==='POST'){await this.purge();return json({deleted:true});}
    if(now>=this.model.s.expiresAt){await this.purge();return json({error:'Session expired'},410);}
    this.model.advance(now);
    if(path==='/socket'){
      if(request.headers.get('upgrade')?.toLowerCase()!=='websocket')return json({error:'WebSocket upgrade required'},426);
      const all=this.ctx.getWebSockets?.()||[];if(all.length>=20)return json({error:'Too many connections'},429);
      const pair=new WebSocketPair(),client=pair[0],server=pair[1];
      this.ctx.acceptWebSocket(server);server.serializeAttachment({unauthenticated:true,createdAt:now});
      // Timely unauthenticated close; never accept input before the ticket.
      const timeout=setTimeout(()=>{if(!this.sockets.has(server))try{server.close(4001,'Authentication required');}catch{}},5000);
      timeout.unref?.();
      return new Response(null,{status:101,webSocket:client});
    }
    if(path==='/state'){await this.after();return json(this.model.snapshot(now));}
    if(request.method!=='POST')return json({error:'Not found'},404);
    let data;try{data=await request.json();}catch{return json({error:'Invalid request'},400);}
    try{
      if(path==='/ticket'){
        this.model.player(data.studentId);
        for(const [key,t] of Object.entries(this.tickets))if(t.expires<=now||t.id===data.studentId)delete this.tickets[key];
        const ticket=crypto.randomUUID()+crypto.randomUUID();this.tickets[ticket]={id:data.studentId,expires:now+LIMITS.ticket};await this.persist();this.schedule();return json({ticket,expiresAt:now+LIMITS.ticket,protocol:PROTOCOL,build:JOURNEY_BUILD});
      }
      if(path==='/ready')this.model.ready(data.studentId,data.upgrades,now);
      else if(path==='/grant')this.model.grant(data.studentId,data.slots,now);
      else if(path==='/control'){
        if(data.action==='pause')this.model.setPause(data.scope==='session'?'session':'team',!!data.paused,now);
        else if(data.action==='start')this.model.launch();
        else if(data.action==='end')this.model.finish('interrupted',data.reason||'teacher_ended');
        else return json({error:'Unknown control'},400);
      }else return json({error:'Not found'},404);
      await this.persist();await this.after(true);return json(this.model.snapshot(now));
    }catch(error){await this.after();return json({error:error.message},400);}
  }
  webSocketMessage(socket,message){return this.enqueue(async()=>{
    if(!this.model)return socket.close(4004,'Run unavailable');
    if(typeof message!=='string'||message.length>4096)return socket.close(4002,'Invalid message');
    const now=Date.now();if(now>=this.model.s.expiresAt)return this.purge();
    let data;try{data=JSON.parse(message);}catch{return socket.close(4002,'Invalid JSON');}
    if(!data||typeof data!=='object'||Array.isArray(data))return socket.close(4002,'Invalid message');
    try{
      let a=this.sockets.get(socket);
      if(!a){
        const t=this.tickets[data.ticket];
        if(data.type!=='authenticate'||data.protocol!==PROTOCOL||data.build!==JOURNEY_BUILD||!t||t.expires<=now)return socket.close(4003,'Ticket expired or invalid');
        delete this.tickets[data.ticket];
        for(const [other,old] of this.sockets)if(old.id===t.id){this.sockets.delete(other);try{other.close(4009,'Controller replaced');}catch{}}
        const epoch=this.model.connect(t.id,now);a={id:t.id,epoch,rateAt:now,count:0};this.sockets.set(socket,a);socket.serializeAttachment(a);await this.persist();
        socket.send(JSON.stringify({type:'authenticated',studentId:t.id,epoch,build:JOURNEY_BUILD,protocol:PROTOCOL}));
      }else{
        if(now-a.rateAt>=1000){a.rateAt=now;a.count=0;}if(++a.count>100)return socket.close(4008,'Message rate exceeded');
        if(data.runId!==this.model.s.runId||data.epoch!==a.epoch)throw Error('Connection identity changed.');
        if(data.type==='reserveHero')this.model.reserve(a.id,data.hero,now);
        else if(data.type==='input')this.model.input(a.id,a.epoch,data,now);
        else if(data.type==='availability')this.model.availability(a.id,a.epoch,data.available,now);
        else if(data.type==='ping')socket.send(JSON.stringify({type:'pong',at:data.at,serverNow:now}));
        else throw Error('Unknown message type.');
      }
      await this.after(data.type!=='input'&&data.type!=='ping');
    }catch(error){try{socket.send(JSON.stringify({type:'error',message:error.message}));}catch{}}
  });}
  webSocketClose(socket,code=1000,reason=''){try{socket.close(code,reason);}catch{}return this.enqueue(async()=>{const a=this.sockets.get(socket);this.sockets.delete(socket);if(a&&this.model)this.model.disconnect(a.id,a.epoch,Date.now());await this.after(true);});}
  webSocketError(socket){return this.webSocketClose(socket);}
  async after(force=false){if(!this.model)return;this.model.advance(Date.now());
    if(this.persistedCritical!==this.model.s.critical){await this.persist();this.persistedCritical=this.model.s.critical;}
    const now=Date.now();if(force||now-this.lastBroadcast>=1000/15){this.lastBroadcast=now;const data=JSON.stringify({type:'snapshot',snapshot:this.model.snapshot(now)});
      for(const [socket] of this.sockets)try{socket.send(data);}catch{}}
    if(this.model.s.result&&!this.delivered&&!this.delivering){this.delivering=true;const task=this.deliver().finally(()=>{this.delivering=false;});this.ctx.waitUntil?.(task);}
    this.schedule();
  }
  async deliver(){try{
    const response=await this.env.SESSIONS.get(this.env.SESSIONS.idFromName(this.meta.roomCode)).fetch(new Request('https://session/journey-result',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({resultKey:this.meta.resultKey,result:this.model.s.result})}));
    if(response.ok){this.delivered=true;this.meta.delivered=true;await this.persist();}
  }catch{/* Persisted outbox is retried by alarm; no client acknowledgement needed. */}}
  schedule(){if(!this.model)return;const s=this.model.s;
    const ticking=!this.model.paused&&['running','launch','recovery'].includes(s.phase);
    if(ticking&&!this.timer){this.timer=setInterval(()=>this.enqueue(()=>this.after()),1000/30);this.timer.unref?.();}
    if(!ticking&&this.timer){clearInterval(this.timer);this.timer=null;}
    let at=s.expiresAt;
    if(s.phase==='ready'&&!this.model.paused&&s.readyMs>0)at=Math.min(at,Date.now()+s.readyMs);
    if(s.result&&!this.delivered)at=Math.min(at,Date.now()+5000);
    if(this.alarmAt!==at){this.alarmAt=at;this.ctx.storage.setAlarm?.(at);}
  }
  alarm(){return this.enqueue(async()=>{if(this.model&&Date.now()>=this.model.s.expiresAt)await this.purge();else await this.after(true);});}
  async purge(){clearInterval(this.timer);this.timer=null;for(const socket of this.ctx.getWebSockets?.()||[])try{socket.close(4004,'Session deleted');}catch{}
    this.sockets.clear();this.model=null;this.tickets={};this.meta=null;await this.ctx.storage.deleteAll();await this.ctx.storage.deleteAlarm?.();}
}
