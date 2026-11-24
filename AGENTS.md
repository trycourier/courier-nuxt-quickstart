# Courier + Nuxt inbox

A Nuxt 4 app with a real-time Courier Inbox. A Nitro server route mints a scoped JWT, and the Vue `<CourierInbox>` from `@trycourier/courier-vue` renders the feed.

Guide: https://www.courier.com/docs/guides/add-an-inbox-to-nuxt

## Commands

- `npm install`: install dependencies (Node 22.18 or newer)
- `npm run dev`: serve the inbox at http://localhost:3000
- `npm run send`: send one inbox message to the demo user and print the request id
- `npm run typecheck` and `npm run build`: check before you finish

## Environment (`.env`, copied from `.env.example`)

- `COURIER_API_KEY`: read from `process.env` in `server/api/courier-token.get.ts` and the scripts

## Files

- `server/api/courier-token.get.ts`: `GET /api/courier-token`, mints the JWT with `client.auth.issueToken`
- `app/components/NotificationInbox.vue`: fetches the token, calls `signIn`, renders `<CourierInbox>`
- `app/app.vue`: the page
- `shared/demo-user.ts`: `DEMO_USER_ID`, shared by the token route and the send script
- `scripts/send.ts`: one message on the `inbox` channel; `scripts/first-send.ts`: the guide's first send

## Rules

- Keep `COURIER_API_KEY` on the server. The browser only ever gets the scoped JWT.
- Take the token's user id from the session, never from the request.
- Scope tokens as `user_id:<id> inbox:read:messages inbox:write:events` and always set `expires_in`.
- Call `signIn` in `onMounted` so it runs only in the browser. No `<ClientOnly>` is needed.
- Send to the same `user_id` the token is scoped to, with `routing: { method: "single", channels: ["inbox"] }`.
- Use `@trycourier/courier`, not raw HTTP, and don't call `/auth/issue-token` from the browser.
