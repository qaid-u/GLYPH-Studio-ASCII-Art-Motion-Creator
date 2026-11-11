import type {Grid, Cell} from './engine';
export type Effect = 'still'|'wave'|'glitch'|'matrix'|'dissolve'|'pulse'|'ripple';
export type Motion = {effect:Effect; duration:number; speed:number; intensity:number; seed:number};
const random=(n:number,seed:number)=>{const x=Math.sin(n*127.1+seed*311.7)*43758.5453123;return x-Math.floor(x)};
export function animate(source:Grid,time:number,m:Motion):Grid {
 if(m.effect==='still'||m.intensity===0)return source;
 const {cols,rows}=source,phase=2*Math.PI*((time*m.speed)/m.duration), intensity=m.intensity, tick=Math.floor(time*m.speed*8);
 const empty:Cell={char:' ',color:'#000000'};
 const cells=Array.from({length:cols*rows},(_,i)=>{const x=i%cols,y=Math.floor(i/cols);let sx=x,sy=y;
  if(m.effect==='wave')sx=Math.round(x+Math.sin(phase+y*.23)*intensity*3);
  if(m.effect==='ripple'){const dx=(x-cols/2)/cols,dy=(y-rows/2)/rows,dist=Math.hypot(dx,dy),offset=Math.sin(dist*20-phase)*intensity*3;sx=Math.round(x+dx*offset);sy=Math.round(y+dy*offset)}
  if(m.effect==='glitch'&&random(y+tick*1000,m.seed)>.91)sx=Math.round(x+(random(y+tick,m.seed+1)-.5)*intensity*12);
  const base=(sx>=0&&sx<cols&&sy>=0&&sy<rows)?source.cells[sy*cols+sx]:empty;
  if(m.effect==='glitch'&&base.char!==' '&&random(i+tick*999,m.seed+2)>.99-intensity*.05)return {...base,char:'@#%+*'[Math.floor(random(i+tick,m.seed+3)*5)]};
  if(m.effect==='dissolve'&&random(i,m.seed)>(1-intensity*(.5-.5*Math.cos(phase))))return empty;
  if(m.effect==='matrix'){if(base.removed)return base;const head=((time*m.speed*8+random(x,m.seed)*rows*2)% (rows+12))-6, distance=(head-y+rows+12)%(rows+12);if(distance<5&&random(i+tick,m.seed+4)<intensity)return {char:'01|:.'[Math.floor(random(i+tick,m.seed+5)*5)],color:'#80f5b5'};return base}
  if(m.effect==='pulse'&&base.char!==' '){return {...base,alpha:1-intensity*.65*(.5-.5*Math.cos(phase))}}
  return base;
 });return {cols,rows,cells};
}
