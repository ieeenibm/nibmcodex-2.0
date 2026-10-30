import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'NIBMCodex2.0_Rulebook_VF.pdf');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Rulebook file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="NIBMCodex2.0_Rulebook_VF.pdf"',
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (err) {
    console.error('Failed to serve rulebook download:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
