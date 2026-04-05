export async function onRequestGet(context) {
  try {
    const id = context.params.id;
    const post = await context.env.BLOG_DB.prepare(
      "SELECT id, title, date, snippet, content FROM posts WHERE id = ?"
    ).bind(id).first();
    
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    return new Response(JSON.stringify(post), {
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

    const id = context.params.id;
    const body = await context.request.json();
    const { title, date, snippet, content } = body;

    await context.env.BLOG_DB.prepare(
      "UPDATE posts SET title = ?, date = ?, snippet = ?, content = ? WHERE id = ?"
    ).bind(title, date, snippet, content, id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const pwd = context.request.headers.get("X-Admin-Password");
    const adminPassword = context.env.ADMIN_PASSWORD || "secret123";
    if (pwd !== adminPassword) {
      return new Response("Unauthorized", { status: 401 });
    }

    const id = context.params.id;

    await context.env.BLOG_DB.prepare(
      "DELETE FROM posts WHERE id = ?"
    ).bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
