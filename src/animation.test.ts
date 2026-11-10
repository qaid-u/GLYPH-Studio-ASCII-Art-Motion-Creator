import {describe,it,expect} from 'vitest';
import {animate,type Effect} from './animation';
import type {Grid} from './engine';
const source:Grid={cols:12,rows:8,cells:Array.from({length:96},(_,i)=>({char:String(i%10),color:'#fff'}))};
describe('animation frames',()=>{for(const effect of ['wave','glitch','matrix','dissolve','pulse','ripple'] as Effect[]){it(`${effect} is deterministic and changes over time`,()=>{const m={effect,duration:5,speed:1,intensity:1,seed:42};expect(animate(source,1,m)).toEqual(animate(source,1,m));expect(animate(source,0,m)).not.toEqual(animate(source,1,m));expect(source.cells[0].char).toBe('0')})}it('periodic effects meet at loop endpoints',()=>{for(const effect of ['wave','dissolve','pulse','ripple'] as Effect[]){const m={effect,duration:5,speed:1,intensity:1,seed:42};expect(animate(source,0,m)).toEqual(animate(source,5,m))}})});
