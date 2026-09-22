// scripts/test-endpoints.mjs
async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting Production Endpoint QA Verification ---');

  // Test 1: PDF Export format
  try {
    const pdfRes = await fetch(`${baseUrl}/api/books/demo-ocean-wonders/export?format=pdf`);
    console.log('Test 1 (PDF Export Status):', pdfRes.status);
    console.log('Test 1 (Content-Type):', pdfRes.headers.get('content-type'));
    console.log('Test 1 (Content-Disposition):', pdfRes.headers.get('content-disposition'));
    const pdfBuf = await pdfRes.arrayBuffer();
    const pdfHeader = String.fromCharCode(...new Uint8Array(pdfBuf.slice(0, 8)));
    console.log('Test 1 (Binary Magic Bytes):', pdfHeader.trim());
    if (pdfHeader.startsWith('%PDF-')) {
      console.log('  -> PASS: Authentic Binary PDF returned!');
    } else {
      console.error('  -> FAIL: Not a binary PDF!');
    }
  } catch (e) {
    console.error('Test 1 Error:', e.message);
  }

  // Test 2: Invalid export format
  try {
    const badRes = await fetch(`${baseUrl}/api/books/demo-ocean-wonders/export?format=exe`);
    console.log('Test 2 (Invalid Export Format):', badRes.status, 'Expected: 400');
  } catch (e) {
    console.error('Test 2 Error:', e.message);
  }

  // Test 3: Unauthenticated /api/books/create POST
  try {
    const anonRes = await fetch(`${baseUrl}/api/books/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Create a test book anonymously' }),
    });
    console.log('Test 3 (Anonymous Book Creation Blocked):', anonRes.status, 'Expected: 401');
    const anonJson = await anonRes.json();
    console.log('Test 3 (Error Message):', anonJson.error);
  } catch (e) {
    console.error('Test 3 Error:', e.message);
  }

  // Test 4: Contact API submission
  try {
    const contactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QA Auditor',
        email: 'qa@example.com',
        message: 'This is a verified test inquiry for BookGenie editorial.',
      }),
    });
    console.log('Test 4 (Contact Submission):', contactRes.status);
    const contactJson = await contactRes.json();
    console.log('Test 4 (Contact Response):', contactJson);
  } catch (e) {
    console.error('Test 4 Error:', e.message);
  }

  // Test 5: Affiliate API submission
  try {
    const affRes = await fetch(`${baseUrl}/api/affiliate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'partner@example.com',
        website: 'https://youtube.com/@creativepublishing',
      }),
    });
    console.log('Test 5 (Affiliate Submission):', affRes.status);
    const affJson = await affRes.json();
    console.log('Test 5 (Affiliate Response):', affJson);
  } catch (e) {
    console.error('Test 5 Error:', e.message);
  }

  // Test 6: Upgrade API unauthenticated check
  try {
    const upRes = await fetch(`${baseUrl}/api/subscription/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'pro' }),
    });
    console.log('Test 6 (Unauthenticated Upgrade Blocked):', upRes.status, 'Expected: 401');
  } catch (e) {
    console.error('Test 6 Error:', e.message);
  }

  // Test 7: Public discovery files
  try {
    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    console.log('Test 7 (robots.txt Status):', robotsRes.status);
    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    console.log('Test 7 (sitemap.xml Status):', sitemapRes.status);
    const secRes = await fetch(`${baseUrl}/.well-known/security.txt`);
    console.log('Test 7 (security.txt Status):', secRes.status);
  } catch (e) {
    console.error('Test 7 Error:', e.message);
  }

  console.log('--- Verification Complete ---');
}

runTests();
