import {it,expect} from 'vitest';
import {emphasizeEdges} from './edge';
it('emphasizes boundaries without changing alpha or the source',()=>{const d=new Uint8ClampedArray([20,20,20,255,220,220,220,255]);const out=emphasizeEdges(d,2,1,1);expect(out[0]).toBeGreaterThan(d[0]);expect(out[3]).toBe(255);expect(d[0]).toBe(20);expect(emphasizeEdges(d,2,1,0)).toBe(d)});
