import Courier from "@trycourier/courier";
import { DEMO_USER_ID } from "../shared/demo-user";

// Sends one message to the demo user's inbox and prints Courier's request id.
// Run it with `npm run send` while `npm run dev` has the page open.
const apiKey = process.env.COURIER_API_KEY;
if (!apiKey || apiKey === "YOUR_COURIER_API_KEY") {
  console.error("COURIER_API_KEY is not set. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const client = new Courier({ apiKey });

const { requestId } = await client.send.message({
  message: {
    to: { user_id: DEMO_USER_ID },
    // `inbox` is a channel like `email` or `sms`. Listing it is what puts the
    // message in the feed.
    routing: { method: "single", channels: ["inbox"] },
    content: { title: "Your report is ready", body: "The export you asked for has finished." },
  },
});

console.log(`Sent to ${DEMO_USER_ID}. Request id: ${requestId}`);
console.log("It's already in the inbox at http://localhost:3000");
