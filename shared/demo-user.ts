/**
 * The one user this sample signs in and sends to.
 *
 * In a real app there is no constant here: the token route reads the user id
 * from the session your app already has (nuxt-auth-utils, Clerk, your own
 * cookie). It's pinned so the token route and the send script agree without
 * you wiring up auth to see the inbox work.
 */
export const DEMO_USER_ID = "sarah-bennett";
