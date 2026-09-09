import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// RFC-4180 compliant CSV line parser supporting quoted fields and embedded commas
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \r\n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true, questions: { select: { order: true }, orderBy: { order: 'desc' }, take: 1 } },
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { csvText, defaultTimeLimit = 30 } = await req.json();
    if (!csvText || typeof csvText !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid csvText' }, { status: 400 });
    }

    const rows = parseCSV(csvText.trim());
    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV must contain a header row and at least one question.' }, { status: 400 });
    }

    // Determine column indices from header
    const header = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Default indices if headers follow standard order
    let qIdx = header.findIndex((h) => h.includes('question') || h === 'q');
    let opt1Idx = header.findIndex((h) => h === 'option1' || h === 'opt1' || h === 'ans1' || h === 'optiona' || h === 'opta' || h === 'a');
    let opt2Idx = header.findIndex((h) => h === 'option2' || h === 'opt2' || h === 'ans2' || h === 'optionb' || h === 'optb' || h === 'b');
    let opt3Idx = header.findIndex((h) => h === 'option3' || h === 'opt3' || h === 'ans3' || h === 'optionc' || h === 'optc' || h === 'c');
    let opt4Idx = header.findIndex((h) => h === 'option4' || h === 'opt4' || h === 'ans4' || h === 'optiond' || h === 'optd' || h === 'd');
    let correctIdx = header.findIndex((h) => h.includes('correct') || h === 'right' || h === 'rightanswer' || h === 'answer' || h === 'ans');

    // Fallback to positional indices: 0: Question, 1: Opt1, 2: Opt2, 3: Opt3, 4: Opt4, 5: Correct
    if (qIdx === -1) qIdx = 0;
    if (opt1Idx === -1) opt1Idx = 1;
    if (opt2Idx === -1) opt2Idx = 2;
    if (opt3Idx === -1) opt3Idx = 3;
    if (opt4Idx === -1) opt4Idx = 4;
    if (correctIdx === -1) correctIdx = 5;

    let currentOrder = (session.questions[0]?.order ?? 0) + 1;
    const questionsToCreate = [];

    const skippedRows: number[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const questionText = row[qIdx]?.trim();
      if (!questionText) {
        skippedRows.push(r + 1);
        continue;
      }

      const opt1 = row[opt1Idx]?.trim();
      const opt2 = row[opt2Idx]?.trim();
      const opt3 = row[opt3Idx]?.trim();
      const opt4 = row[opt4Idx]?.trim();

      const options = [opt1, opt2, opt3, opt4].filter((o): o is string => Boolean(o && o.length > 0));
      if (options.length < 2) {
        skippedRows.push(r + 1);
        continue; // Minimum 2 options required
      }

      const rawCorrect = row[correctIdx]?.trim() || '1';
      let resolvedCorrect = options[0];

      // If correct answer is a number 1-4
      const numChoice = parseInt(rawCorrect, 10);
      if (!isNaN(numChoice) && numChoice >= 1 && numChoice <= options.length) {
        resolvedCorrect = options[numChoice - 1];
      } else {
        // Check if rawCorrect matches one of the options directly
        const matched = options.find((o) => o.toLowerCase() === rawCorrect.toLowerCase());
        if (matched) {
          resolvedCorrect = matched;
        } else {
          // If specified as 'A', 'B', 'C', 'D'
          const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
          const letterIdx = letterMap[rawCorrect.toLowerCase()];
          if (letterIdx !== undefined && letterIdx < options.length) {
            resolvedCorrect = options[letterIdx];
          }
        }
      }

      questionsToCreate.push({
        sessionId,
        type: 'MCQ',
        text: questionText,
        options,
        correctAnswer: resolvedCorrect,
        timeLimit: defaultTimeLimit,
        maxAnswers: 1,
        order: currentOrder++,
      });
    }

    if (questionsToCreate.length === 0) {
      return NextResponse.json({ error: 'No valid questions found in CSV.', skippedRows }, { status: 400 });
    }

    // Bulk create questions
    await prisma.question.createMany({
      data: questionsToCreate,
    });

    return NextResponse.json({
      success: true,
      importedCount: questionsToCreate.length,
      skippedRows,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: 'Failed to import CSV' }, { status: 500 });
  }
}
