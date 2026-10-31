import type { Recipe, RecipeMatch } from "@/types";

/**
 * Chưa chọn nguyên liệu nào: trả về toàn bộ công thức theo thứ tự gốc.
 * Đã chọn: chỉ giữ công thức khớp ít nhất một nguyên liệu bắt buộc,
 * xếp theo tỉ lệ khớp giảm dần, sau đó theo số nguyên liệu còn thiếu tăng dần.
 */
export function matchRecipes(
  recipes: readonly Recipe[],
  selectedIds: readonly string[],
): RecipeMatch[] {
  const have = new Set(selectedIds);

  const matches = recipes.map<RecipeMatch>((recipe) => {
    const required = recipe.ingredients.filter((item) => !item.optional);
    const matched = required
      .filter((item) => have.has(item.ingredientId))
      .map((item) => item.ingredientId);
    const missing = required
      .filter((item) => !have.has(item.ingredientId))
      .map((item) => item.ingredientId);
    const score = required.length === 0 ? 0 : matched.length / required.length;
    return { recipe, matched, missing, score };
  });

  if (have.size === 0) return matches;

  return matches
    .filter((match) => match.matched.length > 0)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length);
}