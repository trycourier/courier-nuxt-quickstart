import Courier from "@trycourier/courier";

// Reads COURIER_API_KEY from the environment.
const client = new Courier();

const { requestId } = await client.send.message({
  message: {
    to: { user_id: "sarah-bennett" },
    routing: { method: "single", channels: ["inbox"] },
    content: { title: "Hello from Courier", body: "Your Nuxt app has an inbox." },
  },
});

console.log(`Sent. Request id: ${requestId}`);
