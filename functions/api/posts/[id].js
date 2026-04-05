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
