import { getStore } from "@netlify/blobs";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const starterItems = [
  {
    id: "seed-poem",
    kind: "poem",
    title: "First Paddle",
    body: "I start before I am ready\nand the water answers anyway.",
    status: "published",
    mood: "clean",
    tags: ["surf", "beginning"],
    created: "2026-04-30",
    updated: "2026-04-30T12:00:00.000Z"
  },
  {
    id: "seed-post",
    kind: "post",
    title: "A place for starting things",
    body: "This site is a workshop first and a portfolio second. The point is to make it easy to begin, save the rough version, and let the public archive grow from real practice.",
    status: "published",
    tags: ["site", "process"],
    created: "2026-04-30",
    updated: "2026-04-30T12:00:00.000Z"
  },
  {
    id: "seed-photo",
    kind: "photo",
    title: "Coastline study",
    body: "A reminder to keep looking at the edge where motion meets patience.",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=82",
    place: "California coast",
    eventDate: "2026-04-30",
    people: "Jerad",
    tags: ["surf", "coast"],
    created: "2026-04-30",
    updated: "2026-04-30T12:00:00.000Z"
  }
];

const allowedKinds = new Set(["poem", "post", "illustration", "photo"]);
const allowedStatuses = new Set(["draft", "polishing", "published"]);

const response = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const getAdminKey = () => Netlify.env.get("JERAD_STUDIO_KEY") || "";

const isAuthorized = (request) => {
  const expected = getAdminKey();
  const provided = request.headers.get("x-admin-key") || "";
  return Boolean(expected) && provided === expected;
};

const requireAdmin = (request) => {
  if (!getAdminKey()) return response({ error: "JERAD_STUDIO_KEY is not set in Netlify environment variables." }, 500);
  if (!isAuthorized(request)) return response({ error: "Admin key required." }, 401);
  return null;
};

const getStoreInstance = () => getStore({ name: "jeradxyz-library", consistency: "strong" });

const readItems = async () => {
  const store = getStoreInstance();
  const items = await store.get("items", { type: "json" });
  return Array.isArray(items) ? items : starterItems;
};

const writeItems = async (items) => {
  const store = getStoreInstance();
  await store.setJSON("items", items);
};

const cleanText = (value, maxLength = 20000) => String(value || "").slice(0, maxLength).trim();

const cleanItem = (raw) => {
  const now = new Date().toISOString();
  const kind = allowedKinds.has(raw?.kind) ? raw.kind : "post";
  const status = allowedStatuses.has(raw?.status) ? raw.status : "draft";

  return {
    id: crypto.randomUUID(),
    kind,
    title: cleanText(raw?.title, 180) || `${kind[0].toUpperCase()}${kind.slice(1)} ${now.slice(0, 10)}`,
    status,
    body: cleanText(raw?.body),
    tags: Array.isArray(raw?.tags) ? raw.tags.map((tag) => cleanText(tag, 40)).filter(Boolean).slice(0, 12) : [],
    imageUrl: cleanText(raw?.imageUrl, 1200000),
    mood: cleanText(raw?.mood, 80),
    source: cleanText(raw?.source, 180),
    place: cleanText(raw?.place, 180),
    eventDate: cleanText(raw?.eventDate, 40),
    people: cleanText(raw?.people, 180),
    created: now.slice(0, 10),
    updated: now
  };
};

export default async (request) => {
  try {
    const items = await readItems();

    if (request.method === "GET") {
      const admin = isAuthorized(request);
      return response({
        mode: admin ? "admin" : "public",
        items: admin ? items : items.filter((item) => item.status === "published")
      });
    }

    const adminError = requireAdmin(request);
    if (adminError) return adminError;

    if (request.method === "POST") {
      const body = await request.json();
      const item = cleanItem(body.item || body);
      const nextItems = [item, ...items];
      await writeItems(nextItems);
      return response({ mode: "admin", items: nextItems, item }, 201);
    }

    if (request.method === "PATCH") {
      const body = await request.json();
      const id = cleanText(body.id, 100);
      const updates = body.updates || {};
      let found = false;
      const nextItems = items.map((item) => {
        if (item.id !== id) return item;
        found = true;
        return {
          ...item,
          status: allowedStatuses.has(updates.status) ? updates.status : item.status,
          title: updates.title === undefined ? item.title : cleanText(updates.title, 180),
          body: updates.body === undefined ? item.body : cleanText(updates.body),
          updated: new Date().toISOString()
        };
      });
      if (!found) return response({ error: "Item not found." }, 404);
      await writeItems(nextItems);
      return response({ mode: "admin", items: nextItems });
    }

    if (request.method === "DELETE") {
      const body = await request.json().catch(() => ({}));
      const nextItems = body.all ? [] : items.filter((item) => item.id !== body.id);
      await writeItems(nextItems);
      return response({ mode: "admin", items: nextItems });
    }

    return response({ error: "Method not allowed." }, 405);
  } catch (error) {
    return response({ error: error.message || "Unexpected server error." }, 500);
  }
};

export const config = {
  path: "/api/library",
  method: ["GET", "POST", "PATCH", "DELETE"]
};
