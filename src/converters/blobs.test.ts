import {it,expect} from 'vitest';
import {detectBlobs} from './blobs';
it('finds connected components with correct bounds and centroids',()=>{const p=new Uint8ClampedArray(4*4*4);for(const i of [0,1,4,10]){p[i*4]=p[i*4+1]=p[i*4+2]=255;p[i*4+3]=255}const r=detectBlobs(p,4,4,128,2,10);expect(r).toHaveLength(1);expect(r[0]).toMatchObject({x:0,y:0,width:2,height:2,area:3});expect(r[0].cx).toBeCloseTo(1/3);expect(r[0].cy).toBeCloseTo(1/3)});
it('ignores fully transparent pixels when detecting dark regions',()=>{const p=new Uint8ClampedArray(16*4);p[(5*4)+3]=255;const r=detectBlobs(p,4,4,10,1,10,'dark');expect(r).toHaveLength(1);expect(r[0]).toMatchObject({x:1,y:1,area:1})});
