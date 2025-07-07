
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c1b0f93752f84f028d48702feb8bf15c',
  appName: 'FTC Scouting Companion',
  webDir: 'dist',
  server: {
    url: 'https://c1b0f937-52f8-4f02-8d48-702feb8bf15c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
