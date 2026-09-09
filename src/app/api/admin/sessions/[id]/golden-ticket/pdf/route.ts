import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionId = (await params).id;
    const { origin } = new URL(req.url);

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        tickets: {
          orderBy: { ticketNumber: 'asc' },
        },
      },
    });

    if (!session || !session.tickets.length) {
      return NextResponse.json({ error: 'No tickets found for this session' }, { status: 404 });
    }

    if (authUser.role !== 'ADMIN' && session.hostId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const pdfDoc = await PDFDocument.create();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Standard A4 dimensions in points (72 points/inch)
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;

    for (const ticket of session.tickets) {
      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      const claimUrl = `${origin}/claim/${ticket.code}`;

      // Generate high-resolution QR code PNG buffer
      const qrBuffer = await QRCode.toBuffer(claimUrl, {
        width: 600,
        margin: 1,
        color: {
          dark: '#0a0f1d', // Dark navy
          light: '#ffffff',
        },
      });

      const qrImage = await pdfDoc.embedPng(qrBuffer);

      // 1. Draw outer dashed border for cut-out
      page.drawRectangle({
        x: 30,
        y: 30,
        width: PAGE_WIDTH - 60,
        height: PAGE_HEIGHT - 60,
        borderColor: rgb(0.02, 0.71, 0.83), // Cyan-500
        borderWidth: 2,
        borderDashArray: [8, 4],
      });

      // 2. Draw Top Header Banner
      page.drawRectangle({
        x: 50,
        y: PAGE_HEIGHT - 130,
        width: PAGE_WIDTH - 100,
        height: 65,
        color: rgb(0.04, 0.06, 0.11), // Navy-950
      });

      const brandText = 'NIBM CODEX 2.0';
      const brandWidth = helveticaBold.widthOfTextAtSize(brandText, 26);
      page.drawText(brandText, {
        x: (PAGE_WIDTH - brandWidth) / 2,
        y: PAGE_HEIGHT - 100,
        size: 26,
        font: helveticaBold,
        color: rgb(0.02, 0.71, 0.83), // Cyan-500
      });

      const subBrandText = 'PHYSICAL ARENA • GOLDEN TICKET SCAVENGER HUNT';
      const subBrandWidth = helvetica.widthOfTextAtSize(subBrandText, 11);
      page.drawText(subBrandText, {
        x: (PAGE_WIDTH - subBrandWidth) / 2,
        y: PAGE_HEIGHT - 120,
        size: 11,
        font: helvetica,
        color: rgb(0.9, 0.9, 0.9),
      });

      // 3. Ticket Number Badge
      const ticketNumStr = `TICKET #${String(ticket.ticketNumber).padStart(2, '0')}`;
      const ticketNumWidth = helveticaBold.widthOfTextAtSize(ticketNumStr, 22);

      page.drawRectangle({
        x: (PAGE_WIDTH - 220) / 2,
        y: PAGE_HEIGHT - 210,
        width: 220,
        height: 44,
        color: rgb(0.06, 0.09, 0.16),
        borderColor: rgb(0.02, 0.71, 0.83),
        borderWidth: 1.5,
      });

      page.drawText(ticketNumStr, {
        x: (PAGE_WIDTH - ticketNumWidth) / 2,
        y: PAGE_HEIGHT - 195,
        size: 22,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });

      // 4. Centered QR Code
      const qrDisplaySize = 340;
      page.drawImage(qrImage, {
        x: (PAGE_WIDTH - qrDisplaySize) / 2,
        y: (PAGE_HEIGHT - qrDisplaySize) / 2 - 20,
        width: qrDisplaySize,
        height: qrDisplaySize,
      });

      // 5. Instruction Footer
      const instr1 = 'SCAN WITH YOUR PHONE TO UNLOCK THE TRIVIA CHALLENGE';
      const instr1Width = helveticaBold.widthOfTextAtSize(instr1, 14);
      page.drawText(instr1, {
        x: (PAGE_WIDTH - instr1Width) / 2,
        y: 150,
        size: 14,
        font: helveticaBold,
        color: rgb(0.04, 0.06, 0.11),
      });

      const instr2 = 'Answer quickly and accurately to score maximum bonus points!';
      const instr2Width = helvetica.widthOfTextAtSize(instr2, 12);
      page.drawText(instr2, {
        x: (PAGE_WIDTH - instr2Width) / 2,
        y: 128,
        size: 12,
        font: helvetica,
        color: rgb(0.3, 0.35, 0.4),
      });

      const sessionInfo = `Arena: ${session.name} • Join PIN: ${session.joinCode} • Valid during live event only`;
      const sessionInfoWidth = helvetica.widthOfTextAtSize(sessionInfo, 10);
      page.drawText(sessionInfo, {
        x: (PAGE_WIDTH - sessionInfoWidth) / 2,
        y: 60,
        size: 10,
        font: helvetica,
        color: rgb(0.5, 0.55, 0.6),
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CodeX2.0_Golden_Tickets_${session.joinCode}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
