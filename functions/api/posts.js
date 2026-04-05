export async function onRequestGet(context) {
  try {
    const { results } = await context.env.BLOG_DB.prepare(
      "SELECT id, title, date, snippet FROM posts ORDER BY id DESC"
    ).all();
    
    // We format the date or just return results
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const pwd = context.request.headers.get("X-Admin-Password");
    // In production, you would configure ADMIN_PASSWORD in Cloudflare Pages settings
    const adminPassword = context.env.ADMIN_PASSWORD || "secret123";
    
    if (pwd !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await context.request.json();
    const { title, date, snippet, content } = body;

    const info = await context.env.BLOG_DB.prepare(
      "INSERT INTO posts (title, date, snippet, content) VALUES (?, ?, ?, ?)"
    ).bind(title, date, snippet, content).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
