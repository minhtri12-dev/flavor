import { mkdir, writeFile } from "node:fs/promises";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API = "https://api.unsplash.com";
const UTM = "utm_source=flavor&utm_medium=referral";
const PER_QUERY = 6;
const OUTPUT_DIR = "scripts/output";

const TARGETS = [
  {
    slug: "hero",
    label: "Hero",
    orientation: "portrait",
    queries: [
      "rustic dinner table home cooked dishes natural light",
      "shared family meal table overhead",
    ],
  },
  {
    slug: "spaghetti-aglio-e-olio",
    label: "Mì Ý tỏi ớt Aglio e Olio",
    orientation: "landscape",
    queries: ["spaghetti aglio e olio", "garlic chili spaghetti"],
  },
  {
    slug: "smoky-tomato-shakshuka",
    label: "Shakshuka cà chua xông khói",
    orientation: "landscape",
    queries: ["shakshuka", "eggs poached tomato pepper sauce skillet"],
  },
  {
    slug: "lemon-avocado-grain-bowl",
    label: "Tô cơm bơ và chanh",
    orientation: "landscape",
    queries: ["avocado rice bowl spinach", "grain bowl avocado lemon"],
  },
  {
    slug: "charred-chicken-salad",
    label: "Salad gà áp chảo",
    orientation: "landscape",
    queries: [
      "grilled chicken salad tomatoes spinach",
      "chicken thigh salad basil",
    ],
  },
  {
    slug: "pan-pizza-margherita",
    label: "Pizza Margherita nướng chảo",
    orientation: "landscape",
    queries: ["margherita pizza basil", "homemade pan pizza tomato"],
  },
  {
    slug: "banana-oat-pancakes",
    label: "Bánh pancake chuối yến mạch",
    orientation: "landscape",
    queries: ["banana oat pancakes", "banana pancakes stack"],
  },
  {
    slug: "buttery-tomato-onion-sauce",
    label: "Sốt cà chua bơ và hành tây",
    orientation: "landscape",
    queries: ["spaghetti tomato sauce", "pasta tomato sauce basil"],
  },
  {
    slug: "soft-scrambled-eggs",
    label: "Trứng bác mềm mịn",
    orientation: "landscape",
    queries: ["soft scrambled eggs toast", "creamy scrambled eggs"],
  },
  {
    slug: "french-rolled-omelette",
    label: "Trứng ốp la cuộn kiểu Pháp",
    orientation: "landscape",
    queries: ["french omelette", "rolled omelette plate"],
  },
  {
    slug: "thit-kho-trung",
    label: "Thịt kho trứng",
    orientation: "landscape",
    queries: [
      "vietnamese braised pork belly eggs",
      "braised pork belly boiled eggs",
    ],
  },
  {
    slug: "ga-xao-sa-ot",
    label: "Gà xào sả ớt",
    orientation: "landscape",
    queries: [
      "lemongrass chicken stir fry",
      "vietnamese chicken lemongrass chili",
    ],
  },
  {
    slug: "trung-chien-ca-chua",
    label: "Trứng chiên cà chua",
    orientation: "landscape",
    queries: ["tomato egg stir fry", "scrambled eggs tomato"],
  },
];

if (!ACCESS_KEY) {
  console.error(
    "Thiếu UNSPLASH_ACCESS_KEY. Hãy tạo .env.local rồi chạy:\n  node --env-file=.env.local scripts/find-image-candidates.mjs",
  );
  process.exit(1);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

async function search(query, orientation) {
  const url = new URL(`${API}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(PER_QUERY));
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });

  const remaining = response.headers.get("x-ratelimit-remaining");
  if (!response.ok) {
    throw new Error(
      `Unsplash trả về ${response.status} cho "${query}": ${await response.text()}`,
    );
  }

  const data = await response.json();
  return { photos: data.results ?? [], remaining };
}

function toCandidate(photo) {
  return {
    id: photo.id,
    thumb: photo.urls.small,
    page: `${photo.links.html}?${UTM}`,
    alt: photo.alt_description,
    description: photo.description,
    photographer: photo.user.name,
    profile: `${photo.user.links.html}?${UTM}`,
    width: photo.width,
    height: photo.height,
  };
}

const results = [];
const idToLabels = new Map();
let lastRemaining = "?";

for (const target of TARGETS) {
  const candidates = new Map();
  let error = null;

  try {
    for (const query of target.queries) {
      const { photos, remaining } = await search(query, target.orientation);
      lastRemaining = remaining ?? lastRemaining;
      for (const photo of photos) {
        if (!candidates.has(photo.id)) candidates.set(photo.id, toCandidate(photo));
      }
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    console.error(error);
  }

  for (const id of candidates.keys()) {
    const labels = idToLabels.get(id) ?? [];
    labels.push(target.label);
    idToLabels.set(id, labels);
  }

  results.push({ target, candidates: [...candidates.values()], error });
  console.log(`${target.label}: ${candidates.size} ứng viên`);
}

function renderCard(candidate, ownLabel) {
  const others = (idToLabels.get(candidate.id) ?? []).filter(
    (label) => label !== ownLabel,
  );
  const warning = others.length
    ? `<p class="warn">Cũng xuất hiện ở: ${escapeHtml(others.join(", "))}</p>`
    : "";

  return `
    <figure class="card">
      <a href="${escapeHtml(candidate.page)}" target="_blank" rel="noopener noreferrer">
        <img src="${escapeHtml(candidate.thumb)}" alt="${escapeHtml(candidate.alt ?? "")}" loading="lazy" />
      </a>
      <figcaption>
        <code class="id">${escapeHtml(candidate.id)}</code>
        <p>${escapeHtml(candidate.alt ?? candidate.description ?? "(không có mô tả)")}</p>
        <p class="meta">
          <a href="${escapeHtml(candidate.profile)}" target="_blank" rel="noopener noreferrer">${escapeHtml(candidate.photographer)}</a>
          · ${candidate.width}×${candidate.height}
        </p>
        ${warning}
      </figcaption>
    </figure>`;
}

const sections = results
  .map(({ target, candidates, error }) => {
    const body = candidates.length
      ? candidates.map((candidate) => renderCard(candidate, target.label)).join("")
      : `<p class="warn">Không có ứng viên.${error ? ` Lỗi: ${escapeHtml(error)}` : ""}</p>`;

    return `
    <section>
      <h2>${escapeHtml(target.label)} <small>${escapeHtml(target.slug)}</small></h2>
      <p class="queries">${target.queries.map(escapeHtml).join(" · ")}</p>
      <div class="grid">${body}</div>
    </section>`;
  })
  .join("");

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>FLAVOR — Ứng viên ảnh Unsplash</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f5f1e8; color: #252720; margin: 0; padding: 2rem; }
  h1 { margin-top: 0; }
  section { margin: 3rem 0; }
  h2 small { font-weight: 400; color: #5c5f54; font-size: 0.8rem; margin-left: 0.5rem; }
  .queries { color: #5c5f54; margin-top: -0.5rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
  .card { margin: 0; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #0001; }
  .card img { display: block; width: 100%; height: 200px; object-fit: cover; }
  figcaption { padding: 0.75rem; font-size: 0.85rem; }
  figcaption p { margin: 0.35rem 0; }
  .id { font-size: 1rem; font-weight: 700; background: #e8dfd0; padding: 0.1rem 0.4rem; border-radius: 4px; }
  .meta { color: #5c5f54; }
  .warn { color: #b3261e; font-weight: 600; }
  a { color: inherit; }
</style>
</head>
<body>
  <h1>Ứng viên ảnh cho FLAVOR</h1>
  <p>Chọn mỗi mục một ảnh và ghi lại <strong>ID</strong>. Ảnh có chữ đỏ nghĩa là cũng là ứng viên cho mục khác, hãy tránh chọn trùng. Số request còn lại trong giờ này: ${escapeHtml(lastRemaining)}.</p>
  ${sections}
</body>
</html>`;

await mkdir(OUTPUT_DIR, { recursive: true });
const outputPath = `${OUTPUT_DIR}/image-candidates.html`;
await writeFile(outputPath, html, "utf8");
console.log(`\nĐã tạo ${outputPath}. Mở file này bằng trình duyệt để duyệt ảnh.`);