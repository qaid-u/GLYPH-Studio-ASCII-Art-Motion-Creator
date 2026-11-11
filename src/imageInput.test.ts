import {it,expect} from 'vitest';
import {validateImage,validImageDimensions} from './imageInput';
it('validates image formats, size and dimensions',()=>{expect(validateImage(new File(['x'],'bad.txt',{type:'text/plain'}))).toMatch(/PNG/);expect(validateImage(new File(['x'],'ok.png',{type:'image/png'}))).toBeNull();expect(validImageDimensions(200,300)).toBe(true);expect(validImageDimensions(0,2)).toBe(false);expect(validImageDimensions(9000,9000)).toBe(false)});
