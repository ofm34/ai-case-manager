// GET /api/patient  — return the (single demo) patient profile
// POST /api/patient — save it
//
// Storage: uses Cloudflare D1 (binding `DB`) when available. For local dev
// without D1, a JSON-file stand-in (data/demo-patient.json) is used. The
// storage layer is intentionally tiny so it can be swapped for real D1
// queries later without touching the frontend.

const JSON_STANDIN = { name: '', dob: '', phone: '', insurance_carrier: '', policy_number: '' };

export async function onRequestGet(context) {
  const { env } = context;
  if (env.DB) {
    // D1 path: single-row demo table.
    const { results } = await env.DB.prepare('SELECT * FROM patients LIMIT 1').all();
    return Response.json(results[0] || {});
  }
  // Stand-in path (local dev / no D1 binding).
  return Response.json(JSON_STANDIN);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const allowed = ['name', 'dob', 'phone', 'insurance_carrier', 'policy_number'];
  const record = {};
  for (const key of allowed) {
    if (typeof body[key] === 'string') record[key] = body[key];
  }

  if (env.DB) {
    await env.DB.prepare(
      `INSERT INTO patients (id, name, dob, phone, insurance_carrier, policy_number)
       VALUES (1, ?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(id) DO UPDATE SET name=?1, dob=?2, phone=?3, insurance_carrier=?4, policy_number=?5`
    ).bind(record.name, record.dob, record.phone, record.insurance_carrier, record.policy_number).run();
    return Response.json({ ok: true, stored: 'd1' });
  }

  // Stand-in path: log to console so a developer can see what would be persisted.
  console.log('[demo-standin] would persist patient record:', JSON.stringify(record));
  return Response.json({ ok: true, stored: 'json-standin (not persisted)' });
}
