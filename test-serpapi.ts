import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { getSearchProvider } from './src/lib/search/index';

async function run() {
  console.log('SEARCH_PROVIDER:', process.env.SEARCH_PROVIDER);
  console.log('SERPAPI_API_KEY length:', process.env.SERPAPI_API_KEY?.length);
  
  const provider = getSearchProvider();
  console.log('Using provider:', provider.constructor.name);
  
  try {
    const results = await provider.search("best budget smartphone 2026 camera comparison", "PRIMARY");
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Error during search:', err);
  }
}

run();
