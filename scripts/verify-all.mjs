// scripts/verify-all.mjs
import { getOceanWondersDemoBook, getDemoBook } from '../lib/book/demo-book.ts';
import { generateBookPdfBuffer } from '../lib/book/pdf-generator.ts';
import { generateEpub3Buffer } from '../lib/book/epub-builder.ts';

async function main() {
  console.log('=== BookGenie End-to-End Verification ===\n');

  // 1. Check Ocean Wonders Demo Quality
  const demo = getOceanWondersDemoBook();
  console.log('1. Demo Verification:');
  console.log('   Title:', demo.title);
  console.log('   Page Count:', demo.pageCount);
  console.log('   Pages Array Length:', demo.pages.length);

  // Check Epigraph attribution on Page 1
  const p1Quote = demo.pages[0].blocks.find(b => b.type === 'quote');
  console.log('   P1 Epigraph:', p1Quote?.text);
  if (!p1Quote?.text?.includes('Jacques-Yves Cousteau')) {
    throw new Error('P1 quote missing Jacques-Yves Cousteau attribution!');
  }

  // Check typo fix
  const p5Text = demo.pages[4].blocks.find(b => b.type === 'paragraph')?.text;
  console.log('   P5 Typo Check:', p5Text?.includes('Spaghetti corals') ? 'FIXED ("Spaghetti corals")' : 'FAIL');
  if (!p5Text?.includes('Spaghetti corals')) {
    throw new Error('Spaghetti corals typo not fixed!');
  }

  // Check Image Plate URLs
  const plates = [demo.pages[2], demo.pages[6], demo.pages[10], demo.pages[14]];
  for (let i = 0; i < plates.length; i++) {
    const imgBlock = plates[i].blocks.find(b => b.type === 'image');
    console.log(`   Plate ${i + 1} Image URL:`, imgBlock?.url || '(missing)');
    if (!imgBlock?.url) {
      throw new Error(`Plate ${i + 1} missing image URL!`);
    }
  }

  // Check Bullet Points
  const bulletPages = [demo.pages[3], demo.pages[7], demo.pages[11], demo.pages[15]];
  let totalBullets = 0;
  for (let i = 0; i < bulletPages.length; i++) {
    const listBlock = bulletPages[i].blocks.find(b => b.type === 'list' || b.type === 'bullet_list');
    totalBullets += (listBlock?.items?.length || 0);
  }
  console.log('   Total Bullet Points across 4 chapters:', totalBullets, '(Expected: 12)');
  if (totalBullets !== 12) {
    throw new Error(`Expected 12 bullets, found ${totalBullets}`);
  }

  // 2. Demo Slugs Resolution
  console.log('\n2. Demo Slugs Verification:');
  const demoSlugs = ['star-explorer', 'silent-path', 'mindful-morning', 'flavours-home', 'ocean-wonders'];
  for (const slug of demoSlugs) {
    const b = getDemoBook(slug);
    if (!b) throw new Error(`Demo slug "${slug}" failed to resolve!`);
    console.log(`   Slug "${slug}" -> "${b.title}" (${b.pages.length} pages)`);
  }

  // 3. Test PDF Generation
  console.log('\n3. PDF Generation Verification:');
  const pdfBuffer = Buffer.from(await generateBookPdfBuffer(demo));
  console.log('   PDF Buffer Size:', (pdfBuffer.length / 1024).toFixed(1), 'KB');
  const pdfMagic = pdfBuffer.slice(0, 5).toString('ascii');
  console.log('   PDF Magic Bytes:', pdfMagic);
  if (pdfMagic !== '%PDF-') {
    throw new Error('Generated PDF does not have %PDF- header!');
  }

  // 4. Test EPUB 3 Generation
  console.log('\n4. EPUB Generation Verification:');
  const epubBuffer = await generateEpub3Buffer(demo);
  console.log('   EPUB Buffer Size:', (epubBuffer.length / 1024).toFixed(1), 'KB');
  const epubMagic = epubBuffer.slice(0, 4).toString('hex');
  console.log('   EPUB Magic Bytes (PK zip header):', epubMagic);
  if (epubMagic !== '504b0304') {
    throw new Error('Generated EPUB does not have PK\\x03\\x04 zip header!');
  }

  console.log('\n=== ALL VERIFICATIONS PASSED CLEANLY! ===\n');
}

main().catch(err => {
  console.error('\nVerification Error:', err);
  process.exit(1);
});
