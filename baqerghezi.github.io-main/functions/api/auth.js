export async function onRequestPost(context) {
  try {
    const pwd = context.request.headers.get("X-Admin-Password");
    const adminPassword = context.env.ADMIN_PASSWORD || "secret123";
    
    if (pwd !== adminPassword) {
      return new Response(JSON.stringify({ success: false }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
