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

export async function publishSessionState(sessionId: string, state: unknown) {
  try {
    const ably = getAblyRest();
    if (!ably) {
      return false;
    }
    const channel = ably.channels.get(`session:${sessionId}`);
    await channel.publish('state-change', state);
    return true;
  } catch (err) {
    console.error(`[Ably] Failed to publish state to session:${sessionId}:`, err);
    return false;
  }
}
