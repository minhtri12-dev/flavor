import { mkdir, readFile, writeFile } from "node:fs/promises";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const API = "https://api.unsplash.com";
const UTM = "utm_source=flavor&utm_medium=referral";
const OUTPUT_DIR = "scripts/output";
const CACHE_PATH = `${OUTPUT_DIR}/search-cache.json`;
const TRACKED_PATH = `${OUTPUT_DIR}/tracked-downloads.json`;
const REPORT_PATH = `${OUTPUT_DIR}/image-selection-report.md`;
const DATA_PATH = "src/data/recipeImages.ts";
const PER_PAGE = 20;
const GOOD_SCORE = 26;
const COMMON_AVOID = [
  "illustration",
  "drawing",
  "painting",
  "cartoon",
  "logo",
  "vector",
  "poster",
];

const TARGETS = [
  {
    key: "hero",
    label: "Hero",
    altVi: "Bàn ăn bày nhiều món nhà làm",
    orientation: "portrait",
    queries: [
      "rustic dinner table home cooked dishes natural light",
      "shared family meal table overhead",
      "food table spread overhead",
    ],
    must: [["table", "dinner", "meal", "dishes", "bowls", "plates", "food"]],
    bonus: ["table", "dishes", "bowls", "plates", "shared", "overhead", "wooden", "dinner", "spread", "family", "herbs"],
    avoid: ["pizza", "burger", "dessert", "cake", "drink", "cocktail", "coffee"],
  },
  {
    key: "spaghetti-aglio-e-olio",
    label: "Spaghetti Aglio e Olio",
    altVi: "Mì Ý tỏi ớt Aglio e Olio",
    orientation: "landscape",
    queries: ["spaghetti aglio e olio", "garlic chili spaghetti", "spaghetti garlic olive oil pasta"],
    must: [["spaghetti", "pasta", "noodle", "noodles"]],
    bonus: ["garlic", "chili", "chilli", "aglio", "olio", "parsley", "olive oil", "spaghetti"],
    avoid: ["meatball", "bolognese", "carbonara"],
  },
  {
    key: "smoky-tomato-shakshuka",
    label: "Smoky Tomato Shakshuka",
    altVi: "Shakshuka cà chua xông khói",
    orientation: "landscape",
    queries: ["shakshuka", "eggs poached tomato pepper sauce skillet", "eggs in tomato sauce pan"],
    must: [["shakshuka", "egg", "eggs"]],
    bonus: ["shakshuka", "tomato", "sauce", "skillet", "pan", "poached", "pepper", "paprika", "feta", "cilantro", "parsley"],
    avoid: ["toast", "benedict", "salad"],
  },
  {
    key: "lemon-avocado-grain-bowl",
    label: "Lemon Avocado Grain Bowl",
    altVi: "Tô cơm bơ và chanh",
    orientation: "landscape",
    queries: ["avocado rice bowl spinach", "grain bowl avocado lemon", "avocado rice bowl"],
    must: [["bowl"], ["avocado", "rice", "spinach", "greens"]],
    bonus: ["avocado", "rice", "spinach", "lemon", "greens", "grain", "healthy", "bowl", "vegetables"],
    avoid: ["sushi", "pizza", "soup", "oatmeal", "smoothie", "acai", "granola"],
  },
  {
    key: "charred-chicken-salad",
    label: "Charred Chicken Salad",
    altVi: "Salad gà áp chảo",
    orientation: "landscape",
    queries: ["grilled chicken salad tomatoes spinach", "chicken thigh salad basil", "grilled chicken salad"],
    must: [["chicken"], ["salad", "greens", "tomato", "tomatoes", "spinach", "lettuce"]],
    bonus: ["grilled", "tomato", "tomatoes", "spinach", "basil", "salad", "charred", "lemon", "greens"],
    avoid: ["fried chicken", "sandwich", "burger", "soup", "wings", "nuggets"],
  },
  {
    key: "pan-pizza-margherita",
    label: "Pan Pizza Margherita",
    altVi: "Pizza Margherita nướng chảo",
    orientation: "landscape",
    queries: ["margherita pizza basil", "homemade pan pizza tomato", "margherita pizza"],
    must: [["pizza"]],
    bonus: ["margherita", "basil", "tomato", "mozzarella", "homemade", "wood", "cheese", "baked"],
    avoid: ["pepperoni", "delivery", "hawaiian", "burger", "box"],
  },
  {
    key: "banana-oat-pancakes",
    label: "Banana Oat Pancakes",
    altVi: "Bánh pancake chuối yến mạch",
    orientation: "landscape",
    queries: ["banana oat pancakes", "banana pancakes stack", "pancakes banana"],
    must: [["pancake", "pancakes"]],
    bonus: ["banana", "oat", "oats", "stack", "syrup", "honey", "breakfast", "fluffy", "berries"],
    avoid: ["waffle", "crepe", "crepes"],
  },
  {
    key: "buttery-tomato-onion-sauce",
    label: "Tomato Sauce with Butter and Onion",
    altVi: "Sốt cà chua bơ và hành tây",
    orientation: "landscape",
    queries: ["spaghetti tomato sauce", "pasta tomato sauce basil", "spaghetti with tomato sauce"],
    must: [["spaghetti", "pasta", "noodle", "noodles"], ["tomato", "sauce", "red"]],
    bonus: ["tomato", "sauce", "basil", "spaghetti", "parmesan", "red", "simple"],
    avoid: ["meatball", "shrimp", "seafood", "bolognese"],
  },
  {
    key: "soft-scrambled-eggs",
    label: "Soft Scrambled Eggs",
    altVi: "Trứng bác mềm mịn",
    orientation: "landscape",
    queries: ["soft scrambled eggs toast", "creamy scrambled eggs", "scrambled eggs on toast"],
    must: [["scrambled"], ["egg", "eggs"]],
    bonus: ["scrambled", "toast", "creamy", "soft", "butter", "chives", "bread", "breakfast", "plate"],
    avoid: ["burrito", "sandwich", "bacon"],
  },
  {
    key: "french-rolled-omelette",
    label: "French Rolled Omelette",
    altVi: "Trứng ốp la cuộn kiểu Pháp",
    orientation: "landscape",
    queries: ["french omelette", "rolled omelette plate", "omelette"],
    must: [["omelette", "omelet"]],
    bonus: ["french", "rolled", "folded", "butter", "herbs", "chives", "pan", "plate", "soft", "egg", "eggs"],
    avoid: ["burrito", "sandwich", "cake"],
  },
  {
    key: "thit-kho-trung",
    label: "Caramelised Pork and Eggs",
    altVi: "Thịt kho trứng",
    orientation: "landscape",
    queries: ["vietnamese braised pork belly eggs", "braised pork belly boiled eggs", "braised pork belly"],
    must: [["pork", "belly"]],
    bonus: ["braised", "eggs", "egg", "caramel", "vietnamese", "rice", "sauce", "stew", "boiled", "soy"],
    avoid: ["bacon", "burger", "sandwich", "ramen", "bbq", "ribs", "raw", "uncooked", "butcher", "market"],
  },
  {
    key: "ga-xao-sa-ot",
    label: "Lemongrass Chilli Chicken",
    altVi: "Gà xào sả ớt",
    orientation: "landscape",
    queries: ["lemongrass chicken stir fry", "vietnamese chicken lemongrass chili", "chicken stir fry chili herbs"],
    must: [["chicken"], ["stir", "lemongrass", "fried", "chili", "chilli"]],
    bonus: ["lemongrass", "chili", "chilli", "stir", "fry", "vietnamese", "garlic", "wok", "herbs", "rice", "spicy"],
    avoid: ["nuggets", "wings", "burger", "salad", "soup", "sandwich", "fried chicken"],
  },
  {
    key: "trung-chien-ca-chua",
    label: "Tomato and Egg Stir-fry",
    altVi: "Trứng chiên cà chua",
    orientation: "landscape",
    queries: ["tomato egg stir fry", "scrambled eggs tomato", "eggs tomato dish"],
    must: [["egg", "eggs"], ["tomato", "tomatoes"]],
    bonus: ["stir", "fry", "scrambled", "tomato", "tomatoes", "egg", "eggs", "rice", "scallion", "onions", "chinese", "plate"],
    avoid: ["shakshuka", "pizza", "sandwich", "benedict", "salad"],
  },
];

if (!ACCESS_KEY) {
  console.error(
    "Thiếu UNSPLASH_ACCESS_KEY. Chạy: node --env-file=.env.local scripts/select-images.mjs",
  );
  process.exit(1);
}

const HEADERS = {
  Authorization: `Client-ID ${ACCESS_KEY}`,
  "Accept-Version": "v1",
};

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

async function search(cache, query, orientation) {
  const key = `${query}|${orientation}`;
  if (cache[key]) return cache[key];

  const url = new URL(`${API}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    const error = new Error(`Unsplash trả về ${response.status} cho "${query}"`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  cache[key] = data.results ?? [];
  return cache[key];
}

function hasWord(text, word) {
  return new RegExp(`\\b${word}`, "i").test(text);
}

function photoText(photo) {
  const tags = (photo.tags ?? []).map((tag) => tag.title);
  return [photo.alt_description, photo.description, ...tags]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scorePhoto(photo, target) {
  const text = photoText(photo);
  const matched = target.must.every((group) =>
    group.some((word) => hasWord(text, word)),
  );
  const bonusHits = target.bonus.filter((word) => hasWord(text, word)).length;
  const avoidHits = [...COMMON_AVOID, ...target.avoid].filter((word) =>
    hasWord(text, word),
  ).length;
  const score =
    (matched ? 20 : 0) +
    bonusHits * 3 -
    avoidHits * 8 +
    Math.min(Math.log10((photo.likes ?? 0) + 1), 3) +
    (photo.width >= 3000 ? 1 : 0);
  const confidence =
    matched && bonusHits >= 2 && avoidHits === 0
      ? "high"
      : matched && avoidHits === 0
        ? "medium"
        : "low";

  return { photo, score, matched, confidence };
}

function rank(pool, target) {
  return [...pool.values()]
    .map((photo) => scorePhoto(photo, target))
    .sort((a, b) => b.score - a.score);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toImage(target, entry) {
  const { photo, confidence } = entry;
  const en = capitalize(
    photo.alt_description ?? photo.description ?? "Photo from Unsplash",
  );
  const vi =
    confidence === "low"
      ? `Ảnh từ Unsplash. Mô tả gốc: ${en}`
      : target.altVi;

  return {
    id: photo.id,
    src: photo.urls.regular,
    alt: { en, vi },
    credit: {
      photographer: photo.user.name,
      profileUrl: `${photo.user.links.html}?${UTM}`,
      photoUrl: `${photo.links.html}?${UTM}`,
    },
  };
}

await mkdir(OUTPUT_DIR, { recursive: true });
const cache = await readJson(CACHE_PATH, {});
const ranked = new Map();

try {
  for (const target of TARGETS) {
    const pool = new Map();
    for (const query of target.queries) {
      for (const photo of await search(cache, query, target.orientation)) {
        pool.set(photo.id, photo);
      }
      const best = rank(pool, target)[0];
      if (best && best.matched && best.score >= GOOD_SCORE) break;
    }
    ranked.set(target.key, rank(pool, target));
    console.log(`${target.label}: ${pool.size} ứng viên`);
  }
} catch (caught) {
  await writeFile(CACHE_PATH, JSON.stringify(cache), "utf8");
  const limited = caught.status === 403 || caught.status === 429;
  console.error(
    limited
      ? "Đã chạm giới hạn request của Unsplash. Kết quả tìm kiếm đã được lưu, hãy chạy lại sau khi qua giờ."
      : String(caught.message ?? caught),
  );
  process.exit(1);
}

await writeFile(CACHE_PATH, JSON.stringify(cache), "utf8");

const pairs = TARGETS.flatMap((target) =>
  (ranked.get(target.key) ?? [])
    .slice(0, 15)
    .map((entry) => ({ target, entry })),
).sort((a, b) => b.entry.score - a.entry.score);

const chosen = new Map();
const used = new Set();
for (const { target, entry } of pairs) {
  if (chosen.has(target.key) || used.has(entry.photo.id)) continue;
  chosen.set(target.key, entry);
  used.add(entry.photo.id);
}

const missing = TARGETS.filter((target) => !chosen.has(target.key));
if (missing.length > 0) {
  console.error(
    `Không tìm được ảnh cho: ${missing.map((target) => target.label).join(", ")}. Chưa ghi đè ${DATA_PATH}. Hãy thêm từ khóa cho các mục này rồi chạy lại.`,
  );
  process.exit(1);
}

const tracked = await readJson(TRACKED_PATH, []);
for (const entry of chosen.values()) {
  const { photo } = entry;
  if (tracked.includes(photo.id)) continue;
  try {
    const response = await fetch(photo.links.download_location, {
      headers: HEADERS,
    });
    if (response.ok) tracked.push(photo.id);
    else console.warn(`Không ghi nhận được lượt dùng cho ${photo.id} (${response.status})`);
  } catch {
    console.warn(`Không ghi nhận được lượt dùng cho ${photo.id}`);
  }
}
await writeFile(TRACKED_PATH, JSON.stringify(tracked, null, 2), "utf8");

const images = new Map(
  TARGETS.map((target) => [target.key, toImage(target, chosen.get(target.key))]),
);
const recipeImages = Object.fromEntries(
  TARGETS.filter((target) => target.key !== "hero").map((target) => [
    target.key,
    images.get(target.key),
  ]),
);

const dataFile = `import type { RecipeImage } from "@/types";

export const HERO_IMAGE: RecipeImage = ${JSON.stringify(images.get("hero"), null, 2)};

export const RECIPE_IMAGES: Record<string, RecipeImage> = ${JSON.stringify(recipeImages, null, 2)};
`;
await writeFile(DATA_PATH, dataFile, "utf8");

const rows = TARGETS.map((target) => {
  const entry = chosen.get(target.key);
  const { photo } = entry;
  const alternatives = (ranked.get(target.key) ?? [])
    .filter((other) => other.photo.id !== photo.id && !used.has(other.photo.id))
    .slice(0, 3)
    .map((other) => other.photo.id)
    .join(", ");
  const description = (photo.alt_description ?? photo.description ?? "").replace(/\|/g, "/");
  return `| ${target.label} | ${photo.id} | ${photo.user.name} | ${entry.confidence} | ${description} | ${alternatives} |`;
});

const report = [
  "# Báo cáo chọn ảnh FLAVOR",
  "",
  "| Vị trí | Photo ID | Nhiếp ảnh gia | Độ tin cậy | Mô tả gốc | Ứng viên thay thế |",
  "| --- | --- | --- | --- | --- | --- |",
  ...rows,
  "",
  `Tổng ảnh: ${chosen.size}. Photo ID khác nhau: ${used.size}.`,
].join("\n");
await writeFile(REPORT_PATH, report, "utf8");

console.log(`\nĐã ghi ${DATA_PATH} và ${REPORT_PATH}.`);
console.log(`Ảnh độ tin cậy thấp: ${[...chosen.entries()].filter(([, entry]) => entry.confidence === "low").map(([key]) => key).join(", ") || "không có"}`);