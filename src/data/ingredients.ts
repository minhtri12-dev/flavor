import { localized } from "@/lib/i18n";
import type { Ingredient, IngredientCategory, Language } from "@/types";

function toId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function group(
  category: IngredientCategory,
  entries: ReadonlyArray<readonly [string, string]>,
): Ingredient[] {
  return entries.map(([en, vi]) => ({
    id: toId(en),
    name: localized(en, vi),
    category,
  }));
}

export const INGREDIENTS: Ingredient[] = [
  ...group("Vegetables", [
    ["Tomato", "Cà chua"],
    ["Garlic", "Tỏi"],
    ["Onion", "Hành tây"],
    ["Scallion", "Hành lá"],
    ["Lemongrass", "Sả"],
    ["Spinach", "Rau bina"],
    ["Bell pepper", "Ớt chuông"],
    ["Zucchini", "Bí ngòi"],
    ["Mushroom", "Nấm"],
    ["Carrot", "Cà rốt"],
  ]),
  ...group("Fruits", [
    ["Lemon", "Chanh vàng"],
    ["Avocado", "Quả bơ"],
    ["Apple", "Táo"],
    ["Banana", "Chuối"],
    ["Lime", "Chanh xanh"],
  ]),
  ...group("Meat", [
    ["Chicken thigh", "Đùi gà"],
    ["Ground beef", "Thịt bò xay"],
    ["Bacon", "Thịt xông khói"],
    ["Pork belly", "Ba chỉ heo"],
  ]),
  ...group("Seafood", [
    ["Shrimp", "Tôm"],
    ["Salmon", "Cá hồi"],
    ["Squid", "Mực"],
  ]),
  ...group("Dairy", [
    ["Egg", "Trứng"],
    ["Butter", "Bơ lạt"],
    ["Parmesan", "Phô mai Parmesan"],
    ["Feta", "Phô mai Feta"],
    ["Milk", "Sữa"],
  ]),
  ...group("Grains", [
    ["Spaghetti", "Mì Ý"],
    ["Rice", "Gạo"],
    ["Flour", "Bột mì"],
    ["Bread", "Bánh mì"],
    ["Oats", "Yến mạch"],
  ]),
  ...group("Spices", [
    ["Black pepper", "Tiêu đen"],
    ["Chili flakes", "Ớt khô xay"],
    ["Paprika", "Ớt paprika"],
    ["Cumin", "Thì là Ai Cập"],
    ["Basil", "Húng quế"],
    ["Oregano", "Oregano"],
    ["Ginger", "Gừng"],
    ["Fish sauce", "Nước mắm"],
  ]),
];

const INGREDIENT_MAP: ReadonlyMap<string, Ingredient> = new Map(
  INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

export function getIngredientName(id: string, lang: Language): string {
  return INGREDIENT_MAP.get(id)?.name[lang] ?? id;
}