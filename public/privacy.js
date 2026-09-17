// Room-scoped credentials. Student credentials are private bearer secrets,
// separate from the public roster ID; never include them in URLs or exports.
export function forgetRoom(code){
  const registry=`mq-local-records-${code}`;
  let keys=[];try{keys=JSON.parse(localStorage.getItem(registry)||'[]');}catch{}
  for(const key of [...keys,registry,`mq-device-${code}`,`mq-student-${code}`,`mq-alias-${code}`,`mq-teacher-${code}`,`mq-expiry-${code}`])localStorage.removeItem(key);
}
export function registerRecord(code,key){
  if(!code)return;const registry=`mq-local-records-${code}`;
  let keys=[];try{keys=JSON.parse(localStorage.getItem(registry)||'[]');}catch{}
  localStorage.setItem(registry,JSON.stringify([...new Set([...keys,key])]));
}
export function credentialFor(code){
  if(typeof localStorage==='undefined')return '';
  const params=new URLSearchParams(globalThis.location?.search||'');
  return (!params.has('student')&&localStorage.getItem(`mq-teacher-${code}`))||localStorage.getItem(`mq-student-${code}`)||'';
}
export function forgetExpiredRooms(){
  const keys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i));
  for(const key of keys)if(key?.startsWith('mq-expiry-')){const expires=Number(localStorage.getItem(key));if(expires&&Date.now()>=expires)forgetRoom(key.slice('mq-expiry-'.length));}
}
