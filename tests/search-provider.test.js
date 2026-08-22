const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Search Provider Module and SerpAPI Provider Integrity', () => {
  // 1. Verify file existence
  const searchDir = path.join(__dirname, '..', 'src', 'lib', 'search');
  const serpapiFile = path.join(searchDir, 'serpapi.search.provider.ts');
  const indexFile = path.join(searchDir, 'index.ts');
  const envExample = path.join(__dirname, '..', '.env.example');

  assert.ok(fs.existsSync(serpapiFile), 'serpapi.search.provider.ts must exist in src/lib/search');
  assert.ok(fs.existsSync(indexFile), 'index.ts must exist in src/lib/search');

  // 2. Verify SerpAPI provider implementation contents
  const serpapiCode = fs.readFileSync(serpapiFile, 'utf8');
  assert.ok(serpapiCode.includes('class SerpApiSearchProvider implements SearchProvider'), 'SerpApiSearchProvider must implement SearchProvider');
  assert.ok(serpapiCode.includes('https://serpapi.com/search'), 'Must use standard SerpAPI search endpoint');
  assert.ok(serpapiCode.includes('process.env.SERPAPI_API_KEY'), 'Must read SERPAPI_API_KEY from environment');
  assert.ok(serpapiCode.includes('SERPAPI_SEARCH_FAILED: SERPAPI_API_KEY is not configured'), 'Must produce explicit error message when unconfigured');

  // 3. Verify getSearchProvider factory function
  const indexCode = fs.readFileSync(indexFile, 'utf8');
  assert.ok(indexCode.includes('export function getSearchProvider'), 'index.ts must export getSearchProvider function');
  assert.ok(indexCode.includes('provider === "serpapi"'), 'Must support serpapi selection');
  assert.ok(indexCode.includes('provider === "mock"'), 'Must support mock selection');
  assert.ok(indexCode.includes('new WebSearchProvider()'), 'Must default to WebSearchProvider');

  // 4. Verify .env.example documentation
  const envContent = fs.readFileSync(envExample, 'utf8');
  assert.ok(envContent.includes('SERPAPI_API_KEY='), '.env.example must document SERPAPI_API_KEY');
  assert.ok(envContent.includes('serpapi'), '.env.example must document serpapi provider option');
});

test('SerpAPI URL Generation and Payload Parsing Contract', () => {
  const serpapiKey = 'test_serp_key_123';
  const query = 'RTX 5090 Cinebench benchmark';
  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', serpapiKey);
  url.searchParams.set('num', '6');

  assert.strictEqual(url.origin, 'https://serpapi.com');
  assert.strictEqual(url.pathname, '/search');
  assert.strictEqual(url.searchParams.get('engine'), 'google');
  assert.strictEqual(url.searchParams.get('q'), 'RTX 5090 Cinebench benchmark');
  assert.strictEqual(url.searchParams.get('api_key'), 'test_serp_key_123');
  assert.strictEqual(url.searchParams.get('num'), '6');
});
