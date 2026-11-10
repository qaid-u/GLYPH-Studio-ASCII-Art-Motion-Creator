import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:90000,workers:1,use:{headless:true,channel:process.env.GLYPH_BROWSER_CHANNEL || 'msedge'},webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173',reuseExistingServer:false,timeout:30000}});
