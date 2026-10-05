// POST /api/login — stub admin authentication.
//
// DEMO ONLY: checks against a placeholder password. This must be replaced
// with real authentication (e.g. Cloudflare Access, or a proper session /
// token flow) before any real data is exposed.

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 });
  }

  // Placeholder password. Prefer a Workers secret: `npx wrangler pages secret put ADMIN_PASSWORD`
  // Falls back to a well-known demo value so the prototype runs out of the box.
  const expected = env.ADMIN_PASSWORD || 'demo-password-change-me';

  if (body.username === 'admin' && body.password === expected) {
    return Response.json({ ok: true, demo: true });
  }
  return Response.json({ error: 'invalid credentials' }, { status: 401 });
}
