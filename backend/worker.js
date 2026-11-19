const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || '*';
  const allowOrigin = allowed === '*' ? '*' : (origin === allowed ? origin : 'null');
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(request, env, body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(request, env), ...extraHeaders }
  });
}

function cleanNickname(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}_ .-]/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 16);
}

async function checkRateLimit(request, env) {
  // Optional KV binding. The API still works without it, but deployment with KV is recommended.
  if (!env.RATE_LIMITS) return true;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `submit:${ip}`;
  const current = Number(await env.RATE_LIMITS.get(key) || 0);
  if (current >= 12) return false;
  await env.RATE_LIMITS.put(key, String(current + 1), { expirationTtl: 3600 });
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    if (path === '/health' && request.method === 'GET') {
      return json(request, env, { ok: true, service: 'cyber-tetris-api', version: 1 });
    }

    if (path === '/leaderboard' && request.method === 'GET') {
      if (!env.DB) return json(request, env, { error: 'D1 binding DB is not configured' }, 503);
      const requested = Number(url.searchParams.get('limit') || 10);
      const limit = Math.max(1, Math.min(50, Number.isFinite(requested) ? Math.floor(requested) : 10));
      try {
        const result = await env.DB.prepare(
          `SELECT nickname, score, level, lines, tetrises, tspins,
                  perfect_clears AS perfectClears, created_at
             FROM scores
            ORDER BY score DESC, created_at ASC
            LIMIT ?`
        ).bind(limit).all();
        return json(request, env, { scores: result.results || [] }, 200, { 'Cache-Control': 'public, max-age=15' });
      } catch (error) {
        return json(request, env, { error: 'Leaderboard query failed', detail: String(error.message || error) }, 500);
      }
    }

    if (path === '/scores' && request.method === 'POST') {
      if (!env.DB) return json(request, env, { error: 'D1 binding DB is not configured' }, 503);
      const origin = request.headers.get('Origin') || '';
      if (env.ALLOWED_ORIGIN && env.ALLOWED_ORIGIN !== '*' && origin !== env.ALLOWED_ORIGIN) {
        return json(request, env, { error: 'Origin is not allowed' }, 403);
      }
      if (!(await checkRateLimit(request, env))) {
        return json(request, env, { error: 'Too many submissions. Try again later.' }, 429);
      }

      let payload;
      try { payload = await request.json(); }
      catch (_) { return json(request, env, { error: 'Invalid JSON body' }, 400); }

      const nickname = cleanNickname(payload.nickname);
      const score = Number(payload.score);
      const level = Number(payload.level);
      const lines = Number(payload.lines);
      const tetrises = Number(payload.tetrises || 0);
      const tspins = Number(payload.tspins || 0);
      const perfectClears = Number(payload.perfectClears || 0);

      if (nickname.length < 2) return json(request, env, { error: 'Nickname must contain 2–16 supported characters' }, 400);
      if (!Number.isSafeInteger(score) || score < 0 || score > 100000000) return json(request, env, { error: 'Score is outside allowed range' }, 400);
      if (!Number.isSafeInteger(level) || level < 1 || level > 999) return json(request, env, { error: 'Level is outside allowed range' }, 400);
      if (!Number.isSafeInteger(lines) || lines < 0 || lines > 100000) return json(request, env, { error: 'Lines are outside allowed range' }, 400);
      for (const [name, value] of Object.entries({ tetrises, tspins, perfectClears })) {
        if (!Number.isSafeInteger(value) || value < 0 || value > 100000) return json(request, env, { error: `${name} is outside allowed range` }, 400);
      }

      try {
        const result = await env.DB.prepare(
          `INSERT INTO scores (nickname, score, level, lines, tetrises, tspins, perfect_clears)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(nickname, score, level, lines, tetrises, tspins, perfectClears).run();
        return json(request, env, { ok: true, id: result.meta?.last_row_id || null }, 201);
      } catch (error) {
        return json(request, env, { error: 'Score save failed', detail: String(error.message || error) }, 500);
      }
    }

    return json(request, env, { error: 'Not found' }, 404);
  }
};
