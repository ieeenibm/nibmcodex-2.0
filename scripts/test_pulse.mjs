import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE_URL = 'http://localhost:3000/api';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("--- Starting Pulse Mini E2E Simulation ---");

  console.log("1. Cleaning Database...");
  await prisma.response.deleteMany({});
  await prisma.participant.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({ where: { username: 'e2e@test.com' } });

  console.log("2. Creating Host & Session...");
  const host = await prisma.user.create({
    data: {
      username: 'e2e@test.com',
      passwordHash: 'password123',
      role: 'HOST'
    }
  });

  const session = await prisma.session.create({
    data: {
      name: 'E2E Test Session',
      mode: 'COMPETITIVE',
      joinCode: 'E2ETST',
      status: 'DRAFT',
      hostId: host.id
    }
  });

  const q1 = await prisma.question.create({
    data: {
      sessionId: session.id,
      text: 'What is 2 + 2?',
      type: 'MCQ',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      timeLimit: 30,
      order: 1
    }
  });

  const q2 = await prisma.question.create({
    data: {
      sessionId: session.id,
      text: 'Is Node.js fast?',
      type: 'MCQ',
      options: ['Yes', 'No'],
      correctAnswer: 'Yes',
      timeLimit: 30,
      order: 2
    }
  });

  console.log("3. Registering Participants...");
  const p1Res = await fetch(`${BASE_URL}/play/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', joinCode: 'E2ETST' })
  });
  const p1 = await p1Res.json();

  const p2Res = await fetch(`${BASE_URL}/play/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob', joinCode: 'E2ETST' })
  });
  const p2 = await p2Res.json();

  console.log("4. Host starts session & active question...");
  await prisma.session.update({
    where: { id: session.id },
    data: { status: 'ACTIVE', activeQuestionId: q1.id, questionStartedAt: new Date() }
  });

  await delay(1000);

  console.log("5. Participants answering Q1...");
  await fetch(`${BASE_URL}/play/${session.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId: p1.participantId, questionId: q1.id, answer: '4' })
  });
  
  await delay(500);

  await fetch(`${BASE_URL}/play/${session.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId: p2.participantId, questionId: q1.id, answer: '5' })
  });

  console.log("6. Host switches to Q2...");
  await prisma.session.update({
    where: { id: session.id },
    data: { activeQuestionId: q2.id, questionStartedAt: new Date() }
  });

  await delay(1000);

  console.log("7. Participants answering Q2...");
  await fetch(`${BASE_URL}/play/${session.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId: p1.participantId, questionId: q2.id, answer: 'Yes' })
  });

  await fetch(`${BASE_URL}/play/${session.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantId: p2.participantId, questionId: q2.id, answer: 'Yes' })
  });

  console.log("8. Host ends session...");
  await prisma.session.update({
    where: { id: session.id },
    data: { status: 'ENDED' }
  });

  console.log("9. Fetching Final Leaderboard...");
  const participants = await prisma.participant.findMany({
    where: { sessionId: session.id },
    orderBy: { score: 'desc' }
  });

  console.log("=== FINAL LEADERBOARD ===");
  participants.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} - ${p.score} pts (Streak: ${p.streak})`);
  });

  console.log("--- Simulation Complete ---");
  await prisma.$disconnect();
  process.exit(0);
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
