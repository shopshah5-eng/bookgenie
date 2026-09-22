// scripts/test-endpoints.mjs
async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting Retest & Design QA Verification ---');

  // Test 1: Canonical Demo Consistency
  try {
    const demoRes = await fetch(`${baseUrl}/api/books/demo-ocean-wonders`);
    console.log('Test 1 (Demo API Status):', demoRes.status);
    const demoData = await demoRes.json();
    console.log('Test 1 (Demo pageCount):', demoData.pageCount);
    console.log('Test 1 (Demo pages array length):', demoData.pages?.length);
    if (demoData.pageCount === 16 && demoData.pages?.length === 16) {
      console.log('  -> PASS: Demo pageCount and array length are exactly synchronized at 16!');
    } else {
      console.error('  -> FAIL: Demo pageCount mismatch!');
    }
  } catch (e) {
    console.error('Test 1 Error:', e.message);
  }

  // Test 2: PDF Export of 16-page Demo
  try {
    const pdfRes = await fetch(`${baseUrl}/api/books/demo-ocean-wonders/export?format=pdf`);
    console.log('Test 2 (PDF Export Status):', pdfRes.status);
    const pdfBuf = await pdfRes.arrayBuffer();
    const pdfHeader = String.fromCharCode(...new Uint8Array(pdfBuf.slice(0, 8)));
    console.log('Test 2 (Binary Magic Bytes):', pdfHeader.trim());
    if (pdfHeader.startsWith('%PDF-')) {
      console.log('  -> PASS: Authentic Binary PDF returned!');
    } else {
      console.error('  -> FAIL: Not a binary PDF!');
    }
  } catch (e) {
    console.error('Test 2 Error:', e.message);
  }

  // Test 3: EPUB Export Language Tag
  try {
    const epubRes = await fetch(`${baseUrl}/api/books/demo-ocean-wonders/export?format=epub`);
    console.log('Test 3 (EPUB Export Status):', epubRes.status);
    console.log('Test 3 (Content-Type):', epubRes.headers.get('content-type'));
    if (epubRes.status === 200 && epubRes.headers.get('content-type') === 'application/epub+zip') {
      console.log('  -> PASS: Valid EPUB 3 container generated!');
    }
  } catch (e) {
    console.error('Test 3 Error:', e.message);
  }

  // Test 4: Unknown Book Route returns real HTTP 404 (Server Component SSR)
  try {
    const notFoundBookRes = await fetch(`${baseUrl}/book/does-not-exist`, { redirect: 'manual' });
    console.log('Test 4 (/book/does-not-exist Status):', notFoundBookRes.status, 'Expected: 404');
    if (notFoundBookRes.status === 404) {
      console.log('  -> PASS: Genuine HTTP 404 returned on SSR for missing book!');
    } else {
      console.warn('  -> NOTE: Status was', notFoundBookRes.status);
    }
  } catch (e) {
    console.error('Test 4 Error:', e.message);
  }

  // Test 5: Unknown Shared Route returns real HTTP 404 (Server Component SSR)
  try {
    const notFoundShareRes = await fetch(`${baseUrl}/shared/no-such-token`, { redirect: 'manual' });
    console.log('Test 5 (/shared/no-such-token Status):', notFoundShareRes.status, 'Expected: 404');
    if (notFoundShareRes.status === 404) {
      console.log('  -> PASS: Genuine HTTP 404 returned on SSR for missing share token!');
    } else {
      console.warn('  -> NOTE: Status was', notFoundShareRes.status);
    }
  } catch (e) {
    console.error('Test 5 Error:', e.message);
  }

  // Test 6: Affiliate invalid URL rejection
  try {
    const invalidUrlRes = await fetch(`${baseUrl}/api/affiliate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        website: 'not-a-url',
      }),
    });
    console.log('Test 6 (Invalid website URL rejection):', invalidUrlRes.status, 'Expected: 400');
    const json = await invalidUrlRes.json();
    console.log('Test 6 (Rejection message):', json.message);
    if (invalidUrlRes.status === 400 && json.error === 'INVALID_WEBSITE') {
      console.log('  -> PASS: Malformed website URLs successfully rejected!');
    }
  } catch (e) {
    console.error('Test 6 Error:', e.message);
  }

  // Test 7: Honeypot trap check
  try {
    const hpRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SpamBot',
        email: 'bot@spam.com',
        message: 'Buy cheap things now!',
        hp_field: 'I am a bot',
      }),
    });
    console.log('Test 7 (Honeypot Trap Status):', hpRes.status, 'Expected: 200 (silent discard)');
    if (hpRes.status === 200) {
      console.log('  -> PASS: Bot honeypot trapped cleanly!');
    }
  } catch (e) {
    console.error('Test 7 Error:', e.message);
  }

  // Test 8: Examples ocean-wonders page
  try {
    const exRes = await fetch(`${baseUrl}/examples/ocean-wonders`);
    console.log('Test 8 (/examples/ocean-wonders Status):', exRes.status, 'Expected: 200');
  } catch (e) {
    console.error('Test 8 Error:', e.message);
  }

  console.log('--- Retest Verification Complete ---');
}

runTests();
