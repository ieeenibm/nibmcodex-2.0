import Ably from 'ably';

let ablyRestInstance: Ably.Rest | null = null;

export function getAblyRest(): Ably.Rest | null {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!ablyRestInstance) {
    ablyRestInstance = new Ably.Rest(apiKey);
  }
  return ablyRestInstance;
}

/**
 * Publish to an Ably channel with retry logic.
 * Throws on failure after retries so callers can handle appropriately.
 */
async function publishWithRetry(
  channelName: string,
  eventName: string,
  data: unknown,
  maxRetries = 2
): Promise<void> {
  const ably = getAblyRest();
  if (!ably) {
    console.warn('[Ably] No API key configured — skipping publish');
    return;
  }

  const channel = ably.channels.get(channelName);
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await channel.publish(eventName, data);
      return; // Success
    } catch (err) {
      lastError = err;
      console.error(`[Ably] Publish attempt ${attempt + 1} failed for ${channelName}:${eventName}:`, err);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 200 * (attempt + 1))); // Backoff
      }
    }
  }

  throw lastError; // Propagate to caller after all retries exhausted
}

/**
 * Broadcast session state change to all connected participants.
 * Throws on failure so the caller can decide whether to rollback.
 */
export async function publishSessionState(sessionId: string, state: unknown): Promise<boolean> {
  try {
    await publishWithRetry(`session:${sessionId}`, 'state-change', state);
    return true;
  } catch (err) {
    console.error(`[Ably] Failed to publish state to session:${sessionId}:`, err);
    return false;
  }
}

/**
 * Notify the host that a new answer was submitted (real-time response counter).
 * Non-critical — failures are logged but swallowed.
 */
export async function publishAnswerSubmitted(sessionId: string, data: {
  questionId: string;
  totalResponses: number;
  correctCount: number;
  mcqDistribution: Record<string, number>;
}): Promise<void> {
  try {
    await publishWithRetry(`session:${sessionId}`, 'answer-submitted', data);
  } catch (err) {
    // Non-critical: host will still get data via SWR fallback polling
    console.error(`[Ably] answer-submitted publish failed (non-critical):`, err);
  }
}

/**
 * Notify the host that a new participant joined the lobby.
 * Non-critical — failures are logged but swallowed.
 */
export async function publishParticipantJoined(sessionId: string, data: {
  participantId: string;
  name: string;
  totalParticipants: number;
}): Promise<void> {
  try {
    await publishWithRetry(`session:${sessionId}`, 'participant-joined', data);
  } catch (err) {
    console.error(`[Ably] participant-joined publish failed (non-critical):`, err);
  }
}

/**
 * Push leaderboard update to all clients.
 * Non-critical — failures are logged but swallowed.
 */
export async function publishLeaderboardUpdate(sessionId: string, data: {
  leaderboard: Array<{ id: string; name: string; score: number; streak: number }>;
}): Promise<void> {
  try {
    await publishWithRetry(`session:${sessionId}`, 'leaderboard-update', data);
  } catch (err) {
    console.error(`[Ably] leaderboard-update publish failed (non-critical):`, err);
  }
}
