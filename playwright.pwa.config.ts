import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:['offline.pwa.ts','security.pwa.ts'],timeout:90000,workers:1,use:{headless:true,channel:process.env.GLYPH_BROWSER_CHANNEL||'msedge'},webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',timeout:30000}});
