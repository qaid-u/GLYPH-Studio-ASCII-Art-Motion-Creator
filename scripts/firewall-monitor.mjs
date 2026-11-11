import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export function parseAlerts(output){
  let data;
  try{data=JSON.parse(output)}catch{throw new Error('Vercel returned invalid alert data.')}
  if(!data||!Array.isArray(data.active)||!Array.isArray(data.resolved))throw new Error('Vercel returned an unexpected alert format.');
  return {active:data.active.length,resolved:data.resolved.length};
}
export async function notifyTelegram({botToken,chatId,counts,test=false,fetchImpl=fetch}){
  if(!/^\d+:[A-Za-z0-9_-]+$/.test(botToken||'')||!/^\-?\d+$/.test(chatId||''))throw new Error('Telegram credentials are missing or invalid.');
  if(!test&&counts.active===0&&counts.resolved===0)return false;
  const heading=test?'GLYPH Studio alert test: Vercel connection succeeded.':'GLYPH Studio: Vercel reported firewall alerts.';
  const message=`${heading}\nActive: ${counts.active} | Resolved in query: ${counts.resolved}\nReview: https://vercel.com/qaid-uqail/glyph-studio-vercel/firewall\nThis only covers Vercel-detected firewall alerts.`;
  let response;
  try{response=await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatId,text:message}),redirect:'error',signal:AbortSignal.timeout(15000)})}catch{throw new Error('Telegram delivery failed.')}
  if(!response.ok)throw new Error('Telegram rejected the notification.');
  let body;try{body=await response.json()}catch{throw new Error('Telegram returned an invalid response.')}
  if(body.ok!==true)throw new Error('Telegram rejected the notification.');
  return true;
}
export async function run({env=process.env,spawn=spawnSync,fetchImpl=fetch}={}){
  const token=env.VERCEL_TOKEN?.trim(),botToken=env.TELEGRAM_BOT_TOKEN?.trim(),chatId=env.TELEGRAM_CHAT_ID?.trim();
  if(!token)throw new Error('VERCEL_TOKEN is missing.');
  if(!botToken||!chatId)throw new Error('Telegram credentials are missing.');
  const childEnv={...process.env};delete childEnv.TELEGRAM_BOT_TOKEN;delete childEnv.TELEGRAM_CHAT_ID;delete childEnv.VERCEL_TOKEN;
  const result=spawn('vercel',['firewall','alerts','list','--project','glyph-studio-vercel','--scope','qaid-uqail','--since','2h','--json','--token',token],{encoding:'utf8',timeout:45000,maxBuffer:4*1024*1024,env:childEnv});
  if(result.error||result.status!==0)throw new Error('Vercel firewall query failed; verify token permissions and project access.');
  const counts=parseAlerts(result.stdout);
  const sent=await notifyTelegram({botToken,chatId,counts,test:env.SEND_TEST==='true',fetchImpl});
  return {counts,sent};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  run().then(({counts,sent})=>console.log(`Firewall check complete: ${counts.active} active, ${counts.resolved} resolved; notification ${sent?'sent':'not needed'}.`)).catch(error=>{console.error(`Firewall monitoring failed: ${error.message}`);process.exitCode=1});
}
