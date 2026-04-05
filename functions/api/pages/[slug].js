export async function onRequestGet(context) {
  try {
    const slug = context.params.slug;
    const page = await context.env.BLOG_DB.prepare(
      "SELECT content FROM pages WHERE slug = ?"
    ).bind(slug).first();
    
    if (!page) {
      return new Response(JSON.stringify({ content: "" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(page), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const pwd = context.request.headers.get("X-Admin-Password");
    const adminPassword = context.env.ADMIN_PASSWORD || "secret123";
    
    if (pwd !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const slug = context.params.slug;
    const body = await context.request.json();
    const { content } = body;

    await context.env.BLOG_DB.prepare(
      "INSERT INTO pages (slug, content) VALUES (?, ?) ON CONFLICT(slug) DO UPDATE SET content = excluded.content"
    ).bind(slug, content).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
