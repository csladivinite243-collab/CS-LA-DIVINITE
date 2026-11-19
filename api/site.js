export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(500).json({ error: "Configuration Supabase manquante." });

  if (req.method === "GET") {
    const r = await fetch(`${url}/rest/v1/site_content?id=eq.public&select=content,updated_at`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    const body = await r.json().catch(() => []);
    if (!r.ok) return res.status(502).json({ error: "Lecture du contenu impossible." });
    return res.status(200).json(body[0]?.content || null);
  }

  if (req.method === "PATCH") {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.status(401).json({ error: "Connexion requise." });
    let content = req.body?.content;
    if (typeof content === "string") {
      try { content = JSON.parse(content); } catch { return res.status(400).json({ error: "Contenu JSON invalide." }); }
    }
    if (!content || typeof content !== "object" || !content.settings || !Array.isArray(content.items)) {
      return res.status(400).json({ error: "Structure du contenu invalide." });
    }
    const r = await fetch(`${url}/rest/v1/site_content?id=eq.public`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: auth,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ content, updated_at: new Date().toISOString() })
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status === 401 || r.status === 403 ? r.status : 502)
        .json({ error: r.status === 401 || r.status === 403 ? "Accès administrateur non autorisé." : "Enregistrement impossible.", detail });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Méthode non autorisée." });
}