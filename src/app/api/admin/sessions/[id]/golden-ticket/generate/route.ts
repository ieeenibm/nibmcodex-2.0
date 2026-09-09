import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true },
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      totalTickets = 15,
      winningCount = 3,
      basePointsWinning = 1000,
      basePointsRegular = 100,
      maxScans = null, // null for unlimited, or a number like 3
      triviaTimeLimit = 15,
    } = await req.json();

    const count = Math.max(1, Math.min(100, parseInt(totalTickets, 10) || 15));
    const winCount = Math.max(0, Math.min(count, parseInt(winningCount, 10) || 3));

    // Trivia Question Pool for Golden Tickets
    const DEFAULT_TRIVIA_BANK = [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"],
        correctAnswer: "Hyper Text Markup Language"
      },
      {
        question: "Which data structure operates on a LIFO (Last In, First Out) basis?",
        options: ["Stack", "Queue", "Array", "Linked List"],
        correctAnswer: "Stack"
      },
      {
        question: "What is the average time complexity of searching in a balanced Binary Search Tree?",
        options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"],
        correctAnswer: "O(log n)"
      },
      {
        question: "Which company originally created the TypeScript programming language?",
        options: ["Microsoft", "Google", "Facebook / Meta", "Apple"],
        correctAnswer: "Microsoft"
      },
      {
        question: "In computer networking, what does DNS stand for?",
        options: ["Domain Name System", "Dynamic Network Service", "Digital Name Server", "Data Network Standard"],
        correctAnswer: "Domain Name System"
      },
      {
        question: "Which HTTP status code signifies 'I'm a teapot' in RFC 2324?",
        options: ["418", "404", "500", "403"],
        correctAnswer: "418"
      },
      {
        question: "What is the primary function of the 'git cherry-pick' command?",
        options: ["Apply specific commit changes from one branch onto another", "Delete unnecessary branches", "Revert the last merge conflict", "Stage only selected file changes"],
        correctAnswer: "Apply specific commit changes from one branch onto another"
      },
      {
        question: "Which protocol operates at the Transport Layer (Layer 4) of the OSI model?",
        options: ["TCP", "HTTP", "IP", "Ethernet"],
        correctAnswer: "TCP"
      },
      {
        question: "Who is widely recognized as the world's first computer programmer?",
        options: ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Charles Babbage"],
        correctAnswer: "Ada Lovelace"
      },
      {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Sequential Query Logic", "Standard Question Language", "System Query Link"],
        correctAnswer: "Structured Query Language"
      },
      {
        question: "What does `typeof NaN` evaluate to in JavaScript?",
        options: ["number", "undefined", "object", "NaN"],
        correctAnswer: "number"
      },
      {
        question: "Which algorithm is used for finding shortest paths in a weighted graph with non-negative edges?",
        options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm", "Bellman-Ford Algorithm"],
        correctAnswer: "Dijkstra's Algorithm"
      },
      {
        question: "In cryptography, what does RSA stand for?",
        options: ["Rivest-Shamir-Adleman", "Rotational Symmetric Algorithm", "Random Secure Architecture", "Recursive Security Access"],
        correctAnswer: "Rivest-Shamir-Adleman"
      },
      {
        question: "What is the default port for secure HTTPS web traffic?",
        options: ["443", "80", "8080", "22"],
        correctAnswer: "443"
      },
      {
        question: "Which architecture was introduced in the breakthrough paper 'Attention Is All You Need'?",
        options: ["Transformer", "RNN", "LSTM", "CNN"],
        correctAnswer: "Transformer"
      },
      {
        question: "Which React hook is designed specifically to perform side effects in components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: "useEffect"
      },
      {
        question: "What does API stand for in software engineering?",
        options: ["Application Programming Interface", "Automated Program Integration", "Advanced Process Interaction", "Application Process Infrastructure"],
        correctAnswer: "Application Programming Interface"
      },
      {
        question: "Which ACID property guarantees that transactions are either fully completed or completely rolled back?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correctAnswer: "Atomicity"
      },
      {
        question: "Which command prints the current working directory in Unix/Linux shells?",
        options: ["pwd", "cd", "ls", "whoami"],
        correctAnswer: "pwd"
      },
      {
        question: "Which sorting algorithm employs a pivot element with average O(n log n) runtime?",
        options: ["Quicksort", "Bubble Sort", "Insertion Sort", "Selection Sort"],
        correctAnswer: "Quicksort"
      }
    ];

    // Optional: fetch existing MCQ questions from the session to enrich question pool
    const sessionQuestions = await prisma.question.findMany({
      where: { sessionId, type: 'MCQ', correctAnswer: { not: null } },
      select: { text: true, options: true, correctAnswer: true },
    });

    const parsedSessionQuestions = sessionQuestions
      .filter((q) => Array.isArray(q.options) && (q.options as string[]).length >= 2 && q.correctAnswer)
      .map((q) => ({
        question: q.text,
        options: q.options as string[],
        correctAnswer: q.correctAnswer as string,
      }));

    const combinedPool = parsedSessionQuestions.length > 0
      ? [...parsedSessionQuestions, ...DEFAULT_TRIVIA_BANK]
      : DEFAULT_TRIVIA_BANK;

    // Shuffle trivia pool so tickets get random questions
    const shuffledTrivia = [...combinedPool].sort(() => Math.random() - 0.5);

    // Determine randomly which tickets are the winning ones
    const ticketIndices = Array.from({ length: count }, (_, i) => i + 1);
    const shuffled = [...ticketIndices].sort(() => Math.random() - 0.5);
    const winningSet = new Set(shuffled.slice(0, winCount));

    // Find current max ticketNumber in this session
    const lastTicket = await prisma.qrTicket.findFirst({
      where: { sessionId },
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true },
    });

    let startNum = (lastTicket?.ticketNumber ?? 0) + 1;
    const ticketsToCreate = [];

    for (let i = 0; i < count; i++) {
      const ticketNumber = startNum + i;
      const isWinning = winningSet.has(i + 1);
      // Generate a clean 10-char alphanumeric secure token
      const code = `TKT-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

      // Pick trivia question for this ticket
      const trivia = shuffledTrivia[i % shuffledTrivia.length];
      // Randomize option order so the answer position varies
      const randomizedOptions = [...trivia.options].sort(() => Math.random() - 0.5);

      ticketsToCreate.push({
        sessionId,
        ticketNumber,
        code,
        isWinning,
        basePoints: isWinning ? basePointsWinning : basePointsRegular,
        maxScans: maxScans ? Math.max(1, parseInt(maxScans, 10)) : null,
        scanCount: 0,
        isExpired: false,
        question: trivia.question,
        options: randomizedOptions,
        correctAnswer: trivia.correctAnswer,
        timeLimit: Math.max(5, parseInt(triviaTimeLimit, 10) || 15),
      });
    }

    await prisma.qrTicket.createMany({
      data: ticketsToCreate,
    });

    const tickets = await prisma.qrTicket.findMany({
      where: { sessionId },
      orderBy: { ticketNumber: 'asc' },
    });

    return NextResponse.json({
      success: true,
      createdCount: ticketsToCreate.length,
      totalTickets: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Generate tickets error:', error);
    return NextResponse.json({ error: 'Failed to generate QR tickets' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const tickets = await prisma.qrTicket.findMany({
      where: { sessionId },
      include: {
        _count: { select: { scans: true } },
      },
      orderBy: { ticketNumber: 'asc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
