import Courier from "@trycourier/courier";
import { DEMO_USER_ID } from "#shared/demo-user";

// GET /api/courier-token mints a short-lived Courier JWT for the signed-in user.
// Your API key signs it, so this runs on the server and the key never reaches
// the browser.
export default defineEventHandler(async (event) => {
  const apiKey = process.env.COURIER_API_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "COURIER_API_KEY is not set. Add it to .env and restart the server.",
    });
  }

  // Read the user from your session here, never from the request: a caller
  // who can name any user id can read that user's inbox. With nuxt-auth-utils:
  // const { user } = await requireUserSession(event); const userId = user.id;
  const userId = DEMO_USER_ID;

  const client = new Courier({ apiKey });

  try {
    const { token } = await client.auth.issueToken({
      scope: `user_id:${userId} inbox:read:messages inbox:write:events`,
      // Always set this. Omitting it mints a token that never expires.
      expires_in: "1 day",
    });

    return { userId, token };
  } catch (cause) {
    // Log the real error on the server, and give the browser a message to show.
    console.error("[courier] issueToken failed:", cause);
    throw createError({
      statusCode: 502,
      statusMessage: "Courier didn't issue a token. Check COURIER_API_KEY.",
    });
  }
});
