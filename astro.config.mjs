// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  image: {
      domains: ['dxdksccsgckuizhjucjz.supabase.co'],
	},

  site: 'https://thecorezi.com',
  output: 'static',
  integrations: [preact()],
});