# Courier Inbox: Nuxt quickstart

A working [Courier Inbox](https://www.courier.com/docs/in-app/overview) in a Nuxt app. A Nuxt server route mints a JWT, the Vue `<CourierInbox>` renders the feed, and one script sends a message that arrives in the open page without a refresh.

This is the companion project for [Add a notification inbox to a Nuxt app](https://www.courier.com/docs/guides/add-an-inbox-to-nuxt) in the Courier docs.

## Build it with a coding agent

Paste this into Claude Code, Cursor, or Codex inside your own Nuxt app:

```text
Add a real-time notification inbox to this Nuxt app with Courier.
Follow https://www.courier.com/docs/guides/add-an-inbox-to-nuxt.md and the reference app at https://github.com/trycourier/courier-nuxt-quickstart.
Use @trycourier/courier in a Nuxt server route that mints the inbox JWT, and read COURIER_API_KEY from the environment.
Take the user id from the session, never from the request, and render <CourierInbox> from @trycourier/courier-vue.
When done, add a send script like the reference app's scripts/send.ts, run it, and show me the request id.
```

Install the Courier skill with `npx skills add trycourier/courier-skills`, and connect the [Courier MCP server](https://www.courier.com/docs/resources/mcp) so the agent can read Courier Logs itself.

## Run it

You need Node 22.18 or newer, a [Courier account](https://app.courier.com/signup), and a [Courier API key](https://app.courier.com/settings/api-keys). A Test key is fine: every environment ships with the Courier Inbox provider configured.

```bash
git clone https://github.com/trycourier/courier-nuxt-quickstart.git
cd courier-nuxt-quickstart
npm install
cp .env.example .env   # paste your API key
npm run dev
```

Open [localhost:3000](http://localhost:3000). The inbox renders, signed in as `sarah-bennett` and empty. Then, in a second terminal:

```bash
npm run send
```

It prints a request id, and the message appears in the open page.

## How the pieces fit

| File | What it does |
|---|---|
| `server/api/courier-token.get.ts` | `GET /api/courier-token`. Signs a JWT scoped to one user with your API key. |
| `app/components/NotificationInbox.vue` | Fetches the token in `onMounted`, calls `signIn`, renders `<CourierInbox>`. |
| `app/app.vue` | The page. |
| `shared/demo-user.ts` | The demo user id, shared by the token route and the send script. |
| `scripts/send.ts` | Sends one message to the demo user's inbox and prints the request id. |
| `scripts/first-send.ts` | The standalone first send from the guide. |

```
Browser                       Nuxt server                   Courier
   |-- GET /api/courier-token -->|                             |
   |                             |-- POST /auth/issue-token -->|  (API key)
   |<------ { userId, token } ---|<----------- JWT ------------|
   |-- signIn({ userId, jwt }) ------------------------------->|  (scoped JWT)
   |<======================= inbox messages, live ============|
```

**No `<ClientOnly>` needed.** The page server-renders an empty `<courier-inbox>` tag, and the browser upgrades it on hydration. Sign-in happens in `onMounted`, which only runs in the browser.

## Adapting it to your app

**Read the real user.** `shared/demo-user.ts` pins a constant so the sample works without auth. In your app, read the user id from your session in the token route, for example with nuxt-auth-utils:

```ts
const { user } = await requireUserSession(event);
const userId = user.id;
```

Never take the user id from the request. A caller who can name any user can read that user's inbox.

**Match the token lifetime to your session.** The route asks for `1 day`. Always set `expires_in`: omitting it mints a token that never expires. The SDK doesn't refresh tokens, so mint a new one and call `signIn` again before the old one expires.

**Why Nuxt 4.4.** Nuxt 4.5 and newer need Node 22.19 or newer, and 4.6 needs 22.22.3. `package.json` pins `nuxt` to `~4.4.8` and `vue-router` to `~5.4.0` so the app runs on Node 22.18 or newer. On a newer Node, drop the pins.

**Set the key where you deploy.** `nuxt dev` loads `.env`. The built server reads `COURIER_API_KEY` from the environment at request time: `COURIER_API_KEY=... node .output/server/index.mjs`.

**Use a template.** `scripts/send.ts` sends inline content so it runs against a fresh workspace. In production, reference a published template by id.

## Scripts

| | |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run send` | Send one message to the demo user's inbox |
| `npm run first-send` | Run the guide's standalone first send |
| `npm run build` | Production build into `.output` |
| `npm run typecheck` | `nuxt typecheck`, then `tsc` over `scripts/` |

## Troubleshooting

**The page says `COURIER_API_KEY is not set`.** Add the key to `.env` (copy `.env.example`) and restart `npm run dev`.

**The inbox renders but stays empty.** Check that the send's `user_id` matches the token's, and find the message in [Courier Logs](https://app.courier.com/logs).

**`Courier didn't issue a token`.** The key is wrong. The server terminal logs Courier's error.

## License

MIT
