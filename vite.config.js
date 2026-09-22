import { defineConfig } from 'vite';
import worker, { QuestSession } from './src/worker.js';
// Development only: the same Worker runs behind Vite without cloud credentials.
// No debug endpoints or fixture shortcuts are included in the deployed Worker.
export default defineConfig({
  root:'public',publicDir:false,
  server:{host:'0.0.0.0',allowedHosts:['terminal.local']},
  plugins:[{name:'mathquest-local-api',configureServer(server){
    const rooms=new Map();
    const env={CORS_ALLOWED_ORIGINS:'http://localhost:5173,http://127.0.0.1:5173,http://terminal.local:5173',SESSIONS:{idFromName:name=>name,get(name){if(!rooms.has(name)){
      const data=new Map(),ctx={storage:{async get(k){return structuredClone(data.get(k));},async put(k,v){data.set(k,structuredClone(v));}},blockConcurrencyWhile:fn=>fn()};rooms.set(name,new QuestSession(ctx));
    }return rooms.get(name);}}};
    server.middlewares.use(async(req,res,next)=>{
      if(!req.url?.startsWith('/api/'))return next();
      try{const chunks=[];for await(const c of req)chunks.push(c);const body=Buffer.concat(chunks);const request=new Request(`http://local${req.url}`,{method:req.method,headers:req.headers,...(body.length?{body}: {})});
        const response=await worker.fetch(request,env);res.statusCode=response.status;for(const[k,v]of response.headers)res.setHeader(k,v);res.end(Buffer.from(await response.arrayBuffer()));
      }catch(error){res.statusCode=500;res.setHeader('content-type','application/json');res.end(JSON.stringify({error:error.message}));}
    });
  }}]
});
