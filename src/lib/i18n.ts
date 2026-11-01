import type { Language, Localized } from "@/types";

export const LANGUAGES: readonly Language[] = ["en", "vi"];

export const DEFAULT_LANGUAGE: Language = "vi";

export function isLanguage(value: string): value is Language {
  return LANGUAGES.some((code) => code === value);
}

export function localized(en: string, vi: string): Localized {
  return { en, vi };
}

const en = {
  nav: {
    main: "Main",
    discover: "Discover",
    cookbook: "My Cookbook",
    pick: "Pick ingredients",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  hero: {
    title: "Something delicious starts here.",
    body: "Tell FLAVOR what is in your kitchen. It finds what you can cook today, ranked by how much you already have.",
    primary: "Start with your ingredients",
    secondary: "Browse recipes",
    caption: "Dinner in 30 minutes or less",
    imageAlt: "A table spread with colourful home-cooked dishes",
  },
  picker: {
    title: "What is in your kitchen?",
    note: "Pick everything you have. The recipes below update as you go.",
    search: "Search ingredients",
    filter: "Filter by category",
    all: "All",
    pantry: "Your pantry",
    pantryLabel: "Selected ingredients",
    selected: (count: number) => `${count} selected`,
    emptyPantry: "Nothing yet. Tap an ingredient to add it.",
    clear: "Clear all",
    remove: (name: string) => `Remove ${name}`,
    noMatch: (query: string) =>
      `No ingredient matches “${query}”. Try a shorter word or pick another category.`,
  },
  categories: {
    Vegetables: "Vegetables",
    Fruits: "Fruits",
    Meat: "Meat",
    Seafood: "Seafood",
    Dairy: "Dairy",
    Grains: "Grains",
    Spices: "Spices",
  },
  difficulty: {
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
  },
  card: {
    minutes: (count: number) => `${count} min`,
    needs: (count: number) => `Needs ${count} ingredients`,
    have: (have: number, total: number) => `You have ${have} of ${total}.`,
    missing: (list: string) => `Missing: ${list}.`,
    ready: "Ready to cook.",
    save: (name: string) => `Save ${name} to your cookbook`,
    unsave: (name: string) => `Remove ${name} from your cookbook`,
    inspiredBy: (name: string) => `Inspired by ${name}`,
    seasoning: "Seasoning notes",
    ring: (have: number, total: number) =>
      `${have} of ${total} ingredients on hand`,
  },
  detail: {
    back: "All recipes",
    servings: "Servings",
    fewer: "Fewer servings",
    more: "More servings",
    ingredients: "Ingredients",
    optional: "optional",
    method: "Method",
    seasoning: "Seasoning notes",
    start: "Start cooking",
    copyList: "Copy shopping list",
    copied: "Copied",
    listTitle: (name: string) => `Shopping list: ${name}`,
  },
  cook: {
    exit: "Exit cooking mode",
    step: (current: number, total: number) => `Step ${current} of ${total}`,
    previous: "Previous step",
    next: "Next step",
    finish: "Finish",
    timer: "Timer",
    minutes: (count: number) => `${count} min`,
    cancel: "Cancel",
    timeUp: "Time is up",
    voice: "Voice control",
    voiceListening: "Listening…",
    voiceHint: "Say “next” or “back”.",
    voiceUnsupported: "Voice control is not supported in this browser.",
    readAloud: "Read aloud",
    progress: "Progress",
    ingredients: "Ingredients",
    servingsNote: (count: number) => `For ${count} servings`,
  },
  shopping: {
    title: "Shopping list",
    note: "Everything your saved recipes need, gathered in one place.",
    empty: "Save a recipe and its ingredients will appear here.",
    copy: "Copy list",
    copied: "Copied",
    reset: "Uncheck all",
    progress: (done: number, total: number) => `${done} of ${total} bought`,
    fromRecipes: (count: number) => `From ${count} saved recipes`,
    listTitle: "Shopping list",
  },
  home: {
    discoverTitleSelected: "Cook this tonight",
    discoverTitleDefault: "Fresh from the kitchen",
    discoverNoteSelected:
      "Ranked by how much of each recipe you already have.",
    discoverNoteDefault:
      "Choose ingredients above to match recipes to your pantry.",
    discoverEmpty:
      "Nothing matches those ingredients yet. Try adding an egg, rice or a tomato.",
    popularTitle: "Popular this week",
    popularEmpty: "No popular recipes right now.",
    quickTitle: (minutes: number) => `Ready in ${minutes} minutes`,
    quickNote: "Quick meals for when time is short.",
    quickEmpty: "No quick meals right now.",
    aboutTitle: "Cook with what you have.",
    aboutBody:
      "FLAVOR starts from your fridge, not from a shopping list. Pick what is on hand, see what it makes, and cook it with clear steps. Less waste, fewer trips to the shop, better dinners.",
    cookbookTitle: "My Cookbook",
    saved: (count: number) => `${count} saved`,
    cookbookEmpty:
      "Nothing saved yet. Tap the heart on any recipe to keep it here.",
  },
  footer: {
    tagline: "Cook with what you have.",
    label: "Footer",
    ingredients: "Ingredients",
    discover: "Discover",
    cookbook: "My Cookbook",
    note: "Recipes are sample content. Chef credits mean “inspired by”; no chef is affiliated with or endorses FLAVOR.",
  },
};

export type Dictionary = typeof en;

const vi: Dictionary = {
  nav: {
    main: "Điều hướng chính",
    discover: "Khám phá",
    cookbook: "Sổ công thức",
    pick: "Chọn nguyên liệu",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    language: "Ngôn ngữ",
  },
  hero: {
    title: "Món ngon bắt đầu từ đây.",
    body: "Cho FLAVOR biết trong bếp bạn đang có gì. FLAVOR sẽ gợi ý món có thể nấu hôm nay, xếp theo mức độ bạn đã có đủ nguyên liệu.",
    primary: "Bắt đầu với nguyên liệu của bạn",
    secondary: "Xem công thức",
    caption: "Bữa tối trong 30 phút hoặc ít hơn",
    imageAlt: "Bàn ăn bày nhiều món nhà làm đầy màu sắc",
  },
  picker: {
    title: "Trong bếp bạn có gì?",
    note: "Chọn mọi thứ bạn đang có. Các công thức bên dưới sẽ cập nhật ngay.",
    search: "Tìm nguyên liệu",
    filter: "Lọc theo nhóm",
    all: "Tất cả",
    pantry: "Tủ bếp của bạn",
    pantryLabel: "Nguyên liệu đã chọn",
    selected: (count: number) => `Đã chọn ${count}`,
    emptyPantry: "Chưa có gì. Chạm vào một nguyên liệu để thêm.",
    clear: "Xóa tất cả",
    remove: (name: string) => `Bỏ ${name}`,
    noMatch: (query: string) =>
      `Không có nguyên liệu nào khớp với “${query}”. Hãy thử từ ngắn hơn hoặc chọn nhóm khác.`,
  },
  categories: {
    Vegetables: "Rau củ",
    Fruits: "Trái cây",
    Meat: "Thịt",
    Seafood: "Hải sản",
    Dairy: "Trứng sữa",
    Grains: "Ngũ cốc",
    Spices: "Gia vị",
  },
  difficulty: {
    Easy: "Dễ",
    Medium: "Vừa",
    Hard: "Khó",
  },
  card: {
    minutes: (count: number) => `${count} phút`,
    needs: (count: number) => `Cần ${count} nguyên liệu`,
    have: (have: number, total: number) => `Bạn đã có ${have}/${total}.`,
    missing: (list: string) => `Còn thiếu: ${list}.`,
    ready: "Sẵn sàng để nấu.",
    save: (name: string) => `Lưu ${name} vào sổ công thức`,
    unsave: (name: string) => `Bỏ ${name} khỏi sổ công thức`,
    inspiredBy: (name: string) => `Lấy cảm hứng từ ${name}`,
    seasoning: "Ghi chú nêm nếm",
    ring: (have: number, total: number) =>
      `Đã có ${have}/${total} nguyên liệu`,
  },
  detail: {
    back: "Tất cả công thức",
    servings: "Khẩu phần",
    fewer: "Giảm khẩu phần",
    more: "Tăng khẩu phần",
    ingredients: "Nguyên liệu",
    optional: "tùy chọn",
    method: "Cách làm",
    seasoning: "Ghi chú nêm nếm",
    start: "Bắt đầu nấu",
    copyList: "Sao chép danh sách đi chợ",
    copied: "Đã sao chép",
    listTitle: (name: string) => `Danh sách đi chợ: ${name}`,
  },
  cook: {
    exit: "Thoát chế độ nấu",
    step: (current: number, total: number) => `Bước ${current}/${total}`,
    previous: "Bước trước",
    next: "Bước tiếp theo",
    finish: "Hoàn thành",
    timer: "Hẹn giờ",
    minutes: (count: number) => `${count} phút`,
    cancel: "Hủy",
    timeUp: "Hết giờ",
    voice: "Điều khiển giọng nói",
    voiceListening: "Đang nghe…",
    voiceHint: "Nói “tiếp theo” hoặc “quay lại”.",
    voiceUnsupported: "Trình duyệt này chưa hỗ trợ điều khiển giọng nói.",
    readAloud: "Đọc to",
    progress: "Tiến độ",
    ingredients: "Nguyên liệu",
    servingsNote: (count: number) => `Cho ${count} khẩu phần`,
  },
  shopping: {
    title: "Danh sách đi chợ",
    note: "Mọi nguyên liệu cho các món đã lưu, gom về một chỗ.",
    empty: "Lưu một công thức, nguyên liệu của nó sẽ hiện ở đây.",
    copy: "Sao chép danh sách",
    copied: "Đã sao chép",
    reset: "Bỏ chọn tất cả",
    progress: (done: number, total: number) => `Đã mua ${done}/${total}`,
    fromRecipes: (count: number) => `Từ ${count} món đã lưu`,
    listTitle: "Danh sách đi chợ",
  },
  home: {
    discoverTitleSelected: "Nấu ngay tối nay",
    discoverTitleDefault: "Mới ra lò từ căn bếp",
    discoverNoteSelected:
      "Xếp theo mức độ bạn đã có đủ nguyên liệu của từng món.",
    discoverNoteDefault:
      "Chọn nguyên liệu ở trên để tìm món hợp với tủ bếp của bạn.",
    discoverEmpty:
      "Chưa có món nào khớp với những nguyên liệu này. Hãy thử thêm trứng, gạo hoặc cà chua.",
    popularTitle: "Được yêu thích tuần này",
    popularEmpty: "Hiện chưa có món nổi bật.",
    quickTitle: (minutes: number) => `Xong trong ${minutes} phút`,
    quickNote: "Món nhanh cho những lúc ít thời gian.",
    quickEmpty: "Hiện chưa có món nhanh.",
    aboutTitle: "Nấu bằng những gì bạn có.",
    aboutBody:
      "FLAVOR bắt đầu từ tủ lạnh của bạn, không phải từ danh sách đi chợ. Chọn những gì đang có, xem có thể nấu món gì, rồi nấu theo từng bước rõ ràng. Ít lãng phí hơn, đỡ phải chạy ra chợ, bữa tối ngon hơn.",
    cookbookTitle: "Sổ công thức",
    saved: (count: number) => `Đã lưu ${count}`,
    cookbookEmpty:
      "Chưa lưu món nào. Chạm vào biểu tượng trái tim ở bất kỳ món nào để giữ lại đây.",
  },
  footer: {
    tagline: "Nấu bằng những gì bạn có.",
    label: "Chân trang",
    ingredients: "Nguyên liệu",
    discover: "Khám phá",
    cookbook: "Sổ công thức",
    note: "Công thức chỉ là nội dung mẫu. Phần ghi tên đầu bếp mang nghĩa “lấy cảm hứng từ”; không đầu bếp nào liên kết hay bảo trợ cho FLAVOR.",
  },
};

export const DICTIONARY: Record<Language, Dictionary> = { en, vi };