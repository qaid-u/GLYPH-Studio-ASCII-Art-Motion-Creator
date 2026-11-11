import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseAlerts,notifyTelegram,run} from '../scripts/firewall-monitor.mjs';
const credentials={botToken:'12345:abc_DEF-ghi',chatId:'123456'};
test('validates Vercel output and counts active and resolved alerts',()=>{
  assert.deepEqual(parseAlerts('{"active":[{}],"resolved":[{},{}]}'),{active:1,resolved:2});
  assert.throws(()=>parseAlerts('{}'),/unexpected/);assert.throws(()=>parseAlerts('not-json'),/invalid/);
});
test('no alerts do not send messages; active alerts do',async()=>{
  let requests=0,body;
  const fetchImpl=async (_url,options)=>{requests++;body=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true})}};
  assert.equal(await notifyTelegram({...credentials,counts:{active:0,resolved:0},fetchImpl}),false);
  assert.equal(requests,0);
  assert.equal(await notifyTelegram({...credentials,counts:{active:1,resolved:0},fetchImpl}),true);
  assert.equal(requests,1);assert.equal(body.chat_id,'123456');assert.match(body.text,/Active: 1/);
});
test('test notification, Telegram errors and invalid credentials',async()=>{
  assert.equal(await notifyTelegram({...credentials,counts:{active:0,resolved:0},test:true,fetchImpl:async()=>({ok:true,json:async()=>({ok:true})})}),true);
  await assert.rejects(()=>notifyTelegram({...credentials,counts:{active:1,resolved:0},fetchImpl:async()=>({ok:false})}),/rejected/);
  await assert.rejects(()=>notifyTelegram({...credentials,botToken:'bad',counts:{active:1,resolved:0}}),/invalid/);
});
test('workflow reports query errors and never sends when data is invalid',async()=>{
  const env={VERCEL_TOKEN:'secret',TELEGRAM_BOT_TOKEN:credentials.botToken,TELEGRAM_CHAT_ID:credentials.chatId};
  let sent=false;const fetchImpl=async()=>{sent=true;return {ok:true,json:async()=>({ok:true})}};
  await assert.rejects(()=>run({env,spawn:()=>({status:1}),fetchImpl}),/query failed/);
  await assert.rejects(()=>run({env,spawn:()=>({status:0,stdout:'{}'}),fetchImpl}),/unexpected/);
  assert.equal(sent,false);
  const result=await run({env,spawn:()=>({status:0,stdout:'{"active":[],"resolved":[]}'}),fetchImpl});
  assert.deepEqual(result,{counts:{active:0,resolved:0},sent:false});
});
