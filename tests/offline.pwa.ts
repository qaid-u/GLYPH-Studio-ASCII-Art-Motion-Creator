import {test,expect} from '@playwright/test';
test('app and previously used subject model work offline after caching',async({page,context})=>{test.setTimeout(120000);await page.goto('http://127.0.0.1:4173');await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);expect(await page.evaluate(async()=>!!await caches.match('/models/u2netp.onnx'))).toBe(false);await page.getByRole('link',{name:/Image to ASCII/}).click();await page.locator('input[type=file]').setInputFiles('tests/fixtures/astronaut.png');await page.getByLabel('Remove image background').check();await expect(page.locator('p[role=status]')).toContainText('Subject isolated',{timeout:75000});expect(await page.evaluate(async()=>!!await caches.match('/models/u2netp.onnx'))).toBe(true);const wasmCached=await page.evaluate(async()=>{for(const name of await caches.keys()){const keys=await (await caches.open(name)).keys();if(keys.some(request=>/\/assets\/ort-wasm-[^/]+\.wasm$/.test(new URL(request.url).pathname)))return true}return false});expect(wasmCached).toBe(true);await context.setOffline(true);await page.goto('http://127.0.0.1:4173/');await expect.poll(()=>page.locator('.feature-card canvas').evaluateAll(cs=>cs.length===8&&cs.every(c=>(c as HTMLCanvasElement).width!==300))).toBe(true);await expect(page.getByRole('group',{name:'Preview style'}).getByRole('button',{name:'ASCII'})).toBeEnabled();await page.getByRole('group',{name:'Preview style'}).getByRole('button',{name:'ASCII'}).click();await expect(page.getByLabel('ASCII rendering of the illustrated portrait')).toBeVisible();await page.getByRole('link',{name:/Image to ASCII/}).click();await expect(page.getByRole('button',{name:'Try demo'})).toBeVisible();await page.locator('input[type=file]').setInputFiles('tests/fixtures/astronaut.png');await page.getByLabel('Remove image background').check();await expect(page.locator('p[role=status]')).toContainText('Subject isolated',{timeout:75000});for(const id of ['one-bit','pink-phosphor','crt','flash-light','receipt','datamosh','blob-tracking']){await page.goto(`http://127.0.0.1:4173/#/converter/${id}`);await page.locator('.converter-page input[type=file]').setInputFiles('tests/fixtures/astronaut.png');await expect(page.getByLabel('Converted image preview')).toBeVisible();if(id==='one-bit'){await page.locator('.converter-page').getByLabel('Remove image background').check();await expect(page.locator('.converter-page p[role=status]')).toContainText('Subject isolated',{timeout:75000});await expect(page.getByLabel('Converted image preview')).toHaveAttribute('data-background-removed','true');await page.getByText('Detailed editing controls').click();const dither=page.locator('.converter-page').getByLabel('Dithering');await dither.selectOption('stochastic');await expect(dither).toHaveValue('stochastic')}}await context.setOffline(false)});
test('homepage image previews and editor work offline',async({page,context})=>{
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.getByLabel('Choose an image for feature previews').setInputFiles('tests/fixtures/astronaut.png');
  await expect(page.getByText(/Using astronaut.png/)).toBeVisible();
  await page.getByRole('link',{name:/Image to One Bit Dither/}).click();
  await expect(page.getByLabel('Converted image preview')).toBeVisible();
});
test('favicon and install icons are available offline',async({page,context})=>{
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);await page.reload();
  const result=await page.evaluate(async()=>{
    const manifest=await (await fetch('/manifest.webmanifest')).json() as {icons:Array<{src:string;sizes:string;purpose?:string}>};
    const icon=manifest.icons.find(i=>i.purpose==='maskable');
    if(!icon)throw Error('Maskable icon missing');
    const sizes=await Promise.all(['/icons/glyph-192.png','/icons/glyph-512.png','/icons/glyph-maskable-512.png','/icons/glyph-touch-180.png','/icons/glyph-32.png'].map(async url=>{const response=await fetch(url);if(!response.ok)throw Error(`Missing ${url}`);const image=await createImageBitmap(await response.blob());return [image.width,image.height]}));
    const svg=await fetch('/icons/glyph.svg');return {icon,sizes,svg:svg.ok,favicon:document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute('href')};
  });
  expect(result.icon.sizes).toBe('512x512');expect(result.sizes).toEqual([[192,192],[512,512],[512,512],[180,180],[32,32]]);expect(result.svg).toBe(true);expect(result.favicon).toBe('/icons/glyph.svg');
});
