import {test,expect} from '@playwright/test';
test('cyber interface stays usable on desktop and mobile',async({page})=>{
  for(const viewport of [{width:1440,height:900},{width:375,height:812}]){
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:5173/');
    await expect(page.getByRole('heading',{name:/make images say more/i})).toBeVisible();
    await expect(page.getByRole('link',{name:/explore the tools/i})).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(8);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.getByRole('link',{name:/Image to ASCII/}).click();
    await expect(page.getByRole('button',{name:'Try demo'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.getByRole('link',{name:'Back to all converters'}).click();
    await page.getByRole('link',{name:/Image to One Bit Dither/}).click();
    await expect(page.getByRole('button',{name:'Choose an image'}).first()).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  }
});
test('homepage switches between the original and real ASCII preview',async({page})=>{
  await page.goto('http://127.0.0.1:5173/');
  const controls=page.getByRole('group',{name:'Preview style'});
  const original=page.getByRole('img',{name:/illustration of a blue-haired character/i});
  const ascii=page.getByLabel('ASCII rendering of the illustrated portrait');
  await expect(original).toBeVisible();
  await expect(controls.getByRole('button',{name:'ASCII'})).toBeEnabled();
  await controls.getByRole('button',{name:'ASCII'}).click();
  await expect(ascii).toBeVisible();
  await expect(original).toBeHidden();
  const colors=await ascii.evaluate((canvas:HTMLCanvasElement)=>new Set(Array.from(canvas.getContext('2d')!.getImageData(0,0,canvas.width,canvas.height).data).filter((_,i)=>i%4!==3)).size);
  expect(colors).toBeGreaterThan(10);
  await controls.getByRole('button',{name:'Compare'}).click();
  await expect(original).toBeVisible();
  await expect(ascii).toBeVisible();
  await page.getByLabel('ASCII reveal amount').fill('75');
  await expect(ascii).toHaveCSS('clip-path','inset(0px 25% 0px 0px)');
  await controls.getByRole('button',{name:'Original'}).click();
  await expect(original).toBeVisible();
});
test('every feature preview is rendered from the homepage image',async({page})=>{
  await page.goto('http://127.0.0.1:5173/');
  const cards=page.locator('.feature-card canvas');
  await expect.poll(()=>cards.evaluateAll(cs=>cs.every(c=>(c as HTMLCanvasElement).width!==300))).toBe(true);
  const original=await cards.evaluateAll(cs=>cs.map(c=>(c as HTMLCanvasElement).toDataURL()));
  expect(new Set(original).size).toBe(8);
  await page.route('**/illustrations/portrait-preview.webp',route=>route.fulfill({path:'tests/fixtures/astronaut.png',contentType:'image/png'}));
  await page.reload();
  await expect.poll(async()=>cards.evaluateAll((cs,prior)=>cs.filter((c,i)=>(c as HTMLCanvasElement).width!==300&&(c as HTMLCanvasElement).toDataURL()!==prior[i]).length,original)).toBe(8);
});
test('homepage image selection updates previews and opens in either editor',async({page})=>{
  await page.goto('http://127.0.0.1:5173/');
  const cards=page.locator('.feature-card canvas');
  await expect.poll(()=>cards.evaluateAll(cs=>cs.every(c=>(c as HTMLCanvasElement).width!==300))).toBe(true);
  const before=await cards.evaluateAll(cs=>cs.map(c=>(c as HTMLCanvasElement).toDataURL()));
  await page.getByLabel('Choose an image for feature previews').setInputFiles('tests/fixtures/astronaut.png');
  await expect(page.getByText(/Using astronaut.png/)).toBeVisible();
  await expect.poll(()=>cards.evaluateAll((cs,prior)=>cs.filter((c,i)=>(c as HTMLCanvasElement).toDataURL()!==prior[i]).length,before)).toBe(8);
  await page.getByRole('link',{name:/Image to ASCII/}).click();
  await expect(page.getByLabel('ASCII art preview')).toBeVisible();
  await page.getByRole('link',{name:'Back to all converters'}).click();
  await page.getByRole('link',{name:/Image to One Bit Dither/}).click();
  await expect(page.getByLabel('Converted image preview')).toBeVisible();
  await expect(page.locator('.converter-page').getByText(/astronaut.png/)).toBeVisible();
});
test('homepage accepts dropped images and rejects invalid files',async({page})=>{
  await page.goto('http://127.0.0.1:5173/');
  await page.getByLabel('Choose an image for feature previews').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('invalid')});
  await expect(page.getByRole('alert')).toContainText('Choose a PNG, JPEG, or WebP');
  const base64=(await import('node:fs')).readFileSync('tests/fixtures/astronaut.png').toString('base64');
  await page.locator('.feature-upload').evaluate((node,data)=>{const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));const transfer=new DataTransfer();transfer.items.add(new File([bytes], 'dropped.png',{type:'image/png'}));node.dispatchEvent(new DragEvent('drop',{bubbles:true,dataTransfer:transfer}));},base64);
  await expect(page.getByText(/Using dropped.png/)).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(page.getByText(/Drop a PNG, JPEG, or WebP here/)).toBeVisible();
});
test('cockpit theme supports keyboard focus and reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(15, 15, 26)');
  const card=page.locator('.feature-card').first();
  await card.focus();
  await expect(card).toBeFocused();
  await expect(card).toHaveCSS('transition-duration','0s');
  await expect(card).toHaveCSS('box-shadow',/rgb\(56, 189, 248\)/);
  await expect(page.locator('.hero-scan')).toBeHidden();
});
