import { localized } from "@/lib/i18n";
import { RECIPE_IMAGES } from "@/data/recipeImages";
import type { Recipe } from "@/types";

const VIETNAM_TRADITION = {
  name: localized("Vietnamese home cooking", "Món nhà truyền thống Việt Nam"),
  origin: localized("Vietnam", "Việt Nam"),
  isChef: false,
};

export const RECIPES: Recipe[] = [
  {
    slug: "spaghetti-aglio-e-olio",
    name: localized("Spaghetti Aglio e Olio", "Mì Ý tỏi ớt Aglio e Olio"),
    description: localized(
      "Garlic sizzled slowly in olive oil, tossed through spaghetti with a pinch of chili.",
      "Tỏi phi chậm trong dầu ô liu, trộn cùng mì Ý và một chút ớt khô.",
    ),
    image: RECIPE_IMAGES["spaghetti-aglio-e-olio"],
    minutes: 20,
    difficulty: "Easy",
    servings: 2,
    popular: true,
    ingredients: [
      { ingredientId: "spaghetti", amount: "200 g" },
      { ingredientId: "garlic", amount: "5" },
      { ingredientId: "chili-flakes", amount: "3 g" },
      { ingredientId: "parmesan", amount: "30 g", optional: true },
      { ingredientId: "black-pepper", optional: true },
    ],
    steps: [
      localized(
        "Boil the spaghetti in well-salted water until just short of tender, saving a cup of the water.",
        "Luộc mì Ý trong nước muối cho đến khi gần chín tới, giữ lại một cốc nước luộc.",
      ),
      localized(
        "Slice the garlic and warm it gently in olive oil with the chili until pale gold.",
        "Thái lát tỏi và phi nhẹ với dầu ô liu cùng ớt cho đến khi vàng nhạt.",
      ),
      localized(
        "Toss the pasta in the pan with a splash of pasta water until glossy, then finish with parmesan.",
        "Cho mì vào chảo, thêm chút nước luộc và đảo cho bóng, rồi rắc phô mai Parmesan.",
      ),
    ],
  },
  {
    slug: "smoky-tomato-shakshuka",
    name: localized("Smoky Tomato Shakshuka", "Shakshuka cà chua xông khói"),
    description: localized(
      "Eggs poached in a paprika-spiced sauce of tomato, pepper and onion.",
      "Trứng chần trong sốt cà chua, ớt chuông và hành tây đậm vị paprika.",
    ),
    image: RECIPE_IMAGES["smoky-tomato-shakshuka"],
    minutes: 30,
    difficulty: "Easy",
    servings: 2,
    popular: true,
    ingredients: [
      { ingredientId: "egg", amount: "4" },
      { ingredientId: "tomato", amount: "4" },
      { ingredientId: "bell-pepper", amount: "1" },
      { ingredientId: "onion", amount: "1" },
      { ingredientId: "paprika", amount: "6 g" },
      { ingredientId: "feta", amount: "50 g", optional: true },
    ],
    steps: [
      localized(
        "Soften the sliced onion and pepper in a wide pan, then stir in the paprika.",
        "Xào mềm hành tây và ớt chuông thái lát trong chảo rộng, rồi cho paprika vào đảo đều.",
      ),
      localized(
        "Add chopped tomatoes and simmer for 12 minutes until thick.",
        "Thêm cà chua cắt nhỏ và om nhỏ lửa 12 phút cho sốt sánh lại.",
      ),
      localized(
        "Make four wells, crack in the eggs, cover and cook until the whites set. Crumble feta over the top.",
        "Tạo bốn hốc nhỏ, đập trứng vào, đậy nắp đến khi lòng trắng đông lại. Bóp vụn phô mai Feta lên trên.",
      ),
    ],
  },
  {
    slug: "lemon-avocado-grain-bowl",
    name: localized("Lemon Avocado Grain Bowl", "Tô cơm bơ và chanh"),
    description: localized(
      "Warm rice, wilted spinach and creamy avocado with a sharp lemon dressing.",
      "Cơm nóng, rau bina mềm và bơ béo ngậy cùng sốt chanh chua nhẹ.",
    ),
    image: RECIPE_IMAGES["lemon-avocado-grain-bowl"],
    minutes: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { ingredientId: "rice", amount: "200 g" },
      { ingredientId: "avocado", amount: "1" },
      { ingredientId: "spinach", amount: "80 g" },
      { ingredientId: "lemon", amount: "1" },
      { ingredientId: "feta", amount: "40 g", optional: true },
    ],
    steps: [
      localized(
        "Warm the rice and fold in the spinach so it wilts in the heat.",
        "Làm nóng cơm và trộn rau bina vào để rau mềm nhờ hơi nóng.",
      ),
      localized(
        "Whisk lemon juice with olive oil and a pinch of salt.",
        "Trộn nước cốt chanh với dầu ô liu và một chút muối.",
      ),
      localized(
        "Top with sliced avocado, drizzle with dressing and add feta if you have it.",
        "Xếp bơ cắt lát lên trên, rưới sốt và thêm phô mai Feta nếu có.",
      ),
    ],
  },
  {
    slug: "charred-chicken-salad",
    name: localized("Charred Chicken Salad", "Salad gà áp chảo"),
    description: localized(
      "Crisp-skinned chicken thigh over tomatoes, spinach and torn basil.",
      "Đùi gà da giòn trên nền cà chua, rau bina và húng quế xé nhỏ.",
    ),
    image: RECIPE_IMAGES["charred-chicken-salad"],
    minutes: 25,
    difficulty: "Medium",
    servings: 2,
    popular: true,
    ingredients: [
      { ingredientId: "chicken-thigh", amount: "2" },
      { ingredientId: "tomato", amount: "2" },
      { ingredientId: "spinach", amount: "100 g" },
      { ingredientId: "basil", amount: "10 g" },
      { ingredientId: "lemon", amount: "1" },
    ],
    steps: [
      localized(
        "Sear the chicken skin-side down in a hot pan for 7 minutes until deeply browned, then flip and finish for 5.",
        "Áp chảo đùi gà phía da xuống trong chảo nóng 7 phút cho vàng đậm, lật mặt và nấu thêm 5 phút.",
      ),
      localized(
        "Toss tomatoes, spinach and basil with lemon juice and olive oil.",
        "Trộn cà chua, rau bina và húng quế với nước cốt chanh và dầu ô liu.",
      ),
      localized(
        "Slice the rested chicken over the salad and serve at once.",
        "Để gà nghỉ một lúc, thái lát đặt lên salad và dùng ngay.",
      ),
    ],
  },
  {
    slug: "pan-pizza-margherita",
    name: localized("Pan Pizza Margherita", "Pizza Margherita nướng chảo"),
    description: localized(
      "Blistered dough, bright tomato sauce and basil torn at the end.",
      "Đế bánh phồng giòn, sốt cà chua tươi và húng quế xé phủ lên cuối cùng.",
    ),
    image: RECIPE_IMAGES["pan-pizza-margherita"],
    minutes: 45,
    difficulty: "Hard",
    servings: 3,
    ingredients: [
      { ingredientId: "flour", amount: "250 g" },
      { ingredientId: "tomato", amount: "4" },
      { ingredientId: "basil", amount: "10 g" },
      { ingredientId: "garlic", amount: "2" },
      { ingredientId: "oregano", amount: "3 g", optional: true },
    ],
    steps: [
      localized(
        "Knead the flour with water, yeast and salt, then rest the dough until doubled.",
        "Nhào bột mì với nước, men và muối, rồi ủ cho bột nở gấp đôi.",
      ),
      localized(
        "Simmer chopped tomato with garlic and oregano into a thick sauce.",
        "Om cà chua cắt nhỏ với tỏi và oregano thành sốt đặc.",
      ),
      localized(
        "Stretch the dough in an oiled pan, add sauce and bake hot until the edge blisters. Finish with basil.",
        "Dàn bột vào chảo đã phết dầu, phết sốt và nướng nóng đến khi viền bánh phồng lên. Cuối cùng rắc húng quế.",
      ),
    ],
  },
  {
    slug: "banana-oat-pancakes",
    name: localized("Banana Oat Pancakes", "Bánh pancake chuối yến mạch"),
    description: localized(
      "Fluffy pancakes sweetened only by ripe bananas.",
      "Bánh pancake bông xốp, vị ngọt hoàn toàn từ chuối chín.",
    ),
    image: RECIPE_IMAGES["banana-oat-pancakes"],
    minutes: 15,
    difficulty: "Easy",
    servings: 2,
    ingredients: [
      { ingredientId: "banana", amount: "2" },
      { ingredientId: "oats", amount: "80 g" },
      { ingredientId: "egg", amount: "2" },
      { ingredientId: "milk", amount: "120 ml" },
      { ingredientId: "butter", amount: "15 g", optional: true },
    ],
    steps: [
      localized(
        "Blend the banana, oats, eggs and milk into a thick batter and rest it for 5 minutes.",
        "Xay chuối, yến mạch, trứng và sữa thành hỗn hợp đặc rồi để nghỉ 5 phút.",
      ),
      localized(
        "Melt a little butter in a pan over medium heat.",
        "Làm chảy một chút bơ trong chảo lửa vừa.",
      ),
      localized(
        "Cook spoonfuls of batter until bubbles form, flip and cook for another minute.",
        "Múc từng muỗng bột vào chảo đến khi nổi bọt, lật mặt và nấu thêm một phút.",
      ),
    ],
  },
  {
    slug: "buttery-tomato-onion-sauce",
    name: localized(
      "Tomato Sauce with Butter and Onion",
      "Sốt cà chua bơ và hành tây",
    ),
    description: localized(
      "Three ingredients simmered slowly into a mellow, silky sauce for pasta.",
      "Ba nguyên liệu om chậm thành sốt mềm, mịn để trộn mì.",
    ),
    image: RECIPE_IMAGES["buttery-tomato-onion-sauce"],
    minutes: 50,
    difficulty: "Easy",
    servings: 3,
    popular: true,
    credit: {
      name: localized("Marcella Hazan", "Marcella Hazan"),
      origin: localized("Italy", "Ý"),
      isChef: true,
    },
    seasoning: [
      localized(
        "Salt is the main seasoning here. Add a small pinch at the start and taste again at the end.",
        "Muối là gia vị chính. Nêm một nhúm nhỏ lúc đầu và nếm lại khi sốt đã sánh.",
      ),
      localized(
        "Butter rounds off the acidity of the tomatoes, so you rarely need sugar.",
        "Bơ làm dịu vị chua của cà chua, nên gần như không cần thêm đường.",
      ),
      localized(
        "The onion only flavours the sauce and is lifted out before serving.",
        "Hành chỉ để lấy hương cho sốt và được vớt bỏ trước khi dùng.",
      ),
    ],
    ingredients: [
      { ingredientId: "tomato", amount: "800 g" },
      { ingredientId: "butter", amount: "70 g" },
      { ingredientId: "onion", amount: "1" },
      { ingredientId: "spaghetti", amount: "200 g", optional: true },
      { ingredientId: "parmesan", amount: "30 g", optional: true },
    ],
    steps: [
      localized(
        "Put the chopped tomatoes, butter, a peeled halved onion and a pinch of salt in a pot.",
        "Cho cà chua cắt nhỏ, bơ, nửa củ hành đã bóc vỏ và một nhúm muối vào nồi.",
      ),
      localized(
        "Simmer uncovered on low heat for about 45 minutes, stirring now and then and crushing the tomatoes.",
        "Om không đậy nắp, lửa nhỏ khoảng 45 phút, thỉnh thoảng khuấy và dằm nát cà chua.",
      ),
      localized(
        "Discard the onion, adjust the salt and toss with hot spaghetti.",
        "Vớt bỏ hành, nêm lại muối rồi trộn với mì Ý nóng.",
      ),
    ],
  },
  {
    slug: "soft-scrambled-eggs",
    name: localized("Soft Scrambled Eggs", "Trứng bác mềm mịn"),
    description: localized(
      "Creamy, small-curd eggs cooked gently and pulled from the heat early.",
      "Trứng bác mịn, hạt nhỏ, nấu nhẹ tay và nhấc khỏi bếp sớm.",
    ),
    image: RECIPE_IMAGES["soft-scrambled-eggs"],
    minutes: 10,
    difficulty: "Medium",
    servings: 1,
    credit: {
      name: localized("Gordon Ramsay", "Gordon Ramsay"),
      origin: localized("United Kingdom", "Vương quốc Anh"),
      isChef: true,
    },
    seasoning: [
      localized(
        "This method seasons near the end, which helps the eggs stay tender.",
        "Cách làm này nêm gần cuối, giúp trứng giữ độ mềm.",
      ),
      localized(
        "Finish with freshly ground black pepper just before serving.",
        "Xay tiêu đen tươi lên ngay trước khi dùng.",
      ),
      localized(
        "Residual heat keeps cooking the eggs, so take them off while still slightly loose.",
        "Nhiệt còn lại vẫn làm trứng chín thêm, nên nhấc ra khi trứng còn hơi lỏng.",
      ),
    ],
    ingredients: [
      { ingredientId: "egg", amount: "3" },
      { ingredientId: "butter", amount: "15 g" },
      { ingredientId: "bread", amount: "2 slices" },
      { ingredientId: "black-pepper", optional: true },
    ],
    steps: [
      localized(
        "Crack the eggs into a cold pan with the butter and set it over medium heat.",
        "Đập trứng vào chảo nguội cùng bơ rồi bắc lên lửa vừa.",
      ),
      localized(
        "Stir constantly, lifting the pan off the heat every few seconds to keep the curds small and soft.",
        "Khuấy liên tục, cứ vài giây lại nhấc chảo khỏi bếp để trứng giữ hạt nhỏ và mềm.",
      ),
      localized(
        "Pull the pan while the eggs still look slightly loose, season and serve on toast.",
        "Nhấc chảo khi trứng còn hơi lỏng, nêm gia vị rồi dọn lên bánh mì nướng.",
      ),
    ],
  },
  {
    slug: "french-rolled-omelette",
    name: localized("French Rolled Omelette", "Trứng ốp la cuộn kiểu Pháp"),
    description: localized(
      "A pale, tender omelette rolled around a creamy centre, with no browning.",
      "Trứng ốp la màu nhạt, mềm, cuộn quanh phần ruột béo mịn, không để cháy xém.",
    ),
    image: RECIPE_IMAGES["french-rolled-omelette"],
    minutes: 10,
    difficulty: "Hard",
    servings: 1,
    credit: {
      name: localized("Jacques Pépin", "Jacques Pépin"),
      origin: localized("France", "Pháp"),
      isChef: true,
    },
    seasoning: [
      localized(
        "Add a pinch of salt to the eggs and whisk well so the seasoning is even.",
        "Cho một nhúm muối vào trứng và đánh kỹ để gia vị đều.",
      ),
      localized(
        "Keep the heat moderate: a good omelette is pale, not golden.",
        "Giữ lửa vừa: trứng ngon có màu nhạt chứ không vàng sẫm.",
      ),
      localized(
        "Pepper is optional and goes in sparingly so it does not overpower the eggs.",
        "Tiêu có thể bỏ qua, nếu dùng thì rất ít để không lấn át vị trứng.",
      ),
    ],
    ingredients: [
      { ingredientId: "egg", amount: "3" },
      { ingredientId: "butter", amount: "10 g" },
      { ingredientId: "black-pepper", optional: true },
    ],
    steps: [
      localized(
        "Whisk the eggs with a pinch of salt until completely uniform.",
        "Đánh trứng với một nhúm muối cho thật đều.",
      ),
      localized(
        "Melt the butter in a nonstick pan until it foams, then pour in the eggs.",
        "Làm chảy bơ trong chảo chống dính đến khi sủi bọt rồi đổ trứng vào.",
      ),
      localized(
        "Stir and shake the pan, then roll the omelette onto a plate while the centre is still soft.",
        "Vừa khuấy vừa lắc chảo, rồi cuộn trứng ra đĩa khi phần giữa còn mềm.",
      ),
    ],
  },
  {
    slug: "thit-kho-trung",
    name: localized("Caramelised Pork and Eggs", "Thịt kho trứng"),
    description: localized(
      "Pork belly and boiled eggs braised in a sweet-salty caramel sauce.",
      "Ba chỉ heo và trứng luộc kho trong nước màu đậm vị mặn ngọt.",
    ),
    image: RECIPE_IMAGES["thit-kho-trung"],
    minutes: 60,
    difficulty: "Medium",
    servings: 4,
    credit: VIETNAM_TRADITION,
    seasoning: [
      localized(
        "Cook the sugar only to a light amber; a darker caramel turns bitter.",
        "Chỉ đun đường đến màu cánh gián nhạt; để sẫm hơn nước màu sẽ bị đắng.",
      ),
      localized(
        "Start with less fish sauce than you think, because the sauce reduces and gets saltier.",
        "Nêm nước mắm ít hơn dự tính, vì nước kho cạn dần sẽ mặn hơn.",
      ),
      localized(
        "Taste at the end and balance sweet and salty before adding the eggs.",
        "Nếm lại ở cuối và cân bằng vị mặn ngọt trước khi cho trứng vào.",
      ),
    ],
    ingredients: [
      { ingredientId: "pork-belly", amount: "400 g" },
      { ingredientId: "egg", amount: "4" },
      { ingredientId: "fish-sauce", amount: "45 ml" },
      { ingredientId: "garlic", amount: "3" },
      { ingredientId: "scallion", amount: "2", optional: true },
    ],
    steps: [
      localized(
        "Cut the pork into chunks, blanch briefly and drain. Boil and peel the eggs.",
        "Cắt ba chỉ thành miếng, chần sơ rồi để ráo. Luộc và bóc vỏ trứng.",
      ),
      localized(
        "Melt a spoon of sugar to light amber, add the pork and garlic, then fish sauce and enough water to cover.",
        "Thắng một muỗng đường đến màu cánh gián nhạt, cho thịt và tỏi vào, thêm nước mắm và nước vừa ngập.",
      ),
      localized(
        "Simmer for 40 minutes, add the eggs and cook 15 minutes more until the sauce is glossy.",
        "Kho nhỏ lửa 40 phút, cho trứng vào kho thêm 15 phút đến khi nước sánh bóng.",
      ),
    ],
  },
  {
    slug: "ga-xao-sa-ot",
    name: localized("Lemongrass Chilli Chicken", "Gà xào sả ớt"),
    description: localized(
      "Chicken stir-fried hard with lemongrass, garlic and chilli until fragrant.",
      "Gà xào lửa lớn với sả, tỏi và ớt cho thơm nức.",
    ),
    image: RECIPE_IMAGES["ga-xao-sa-ot"],
    minutes: 30,
    difficulty: "Easy",
    servings: 2,
    credit: VIETNAM_TRADITION,
    seasoning: [
      localized(
        "Put half the lemongrass in the marinade and the rest in at the end for fresh aroma.",
        "Cho một nửa sả vào ướp, nửa còn lại xào cuối để giữ hương thơm tươi.",
      ),
      localized(
        "Season with fish sauce in the marinade, not at the end, so it coats the meat evenly.",
        "Nêm nước mắm lúc ướp chứ không nêm cuối, để gia vị thấm đều vào thịt.",
      ),
      localized(
        "Adjust the chilli to taste.",
        "Tăng giảm lượng ớt tùy khẩu vị.",
      ),
    ],
    ingredients: [
      { ingredientId: "chicken-thigh", amount: "400 g" },
      { ingredientId: "lemongrass", amount: "2 stalks" },
      { ingredientId: "garlic", amount: "3" },
      { ingredientId: "chili-flakes", amount: "5 g" },
      { ingredientId: "fish-sauce", amount: "30 ml" },
    ],
    steps: [
      localized(
        "Mince the lemongrass and garlic. Marinate the sliced chicken with half of them and the fish sauce for 15 minutes.",
        "Băm nhỏ sả và tỏi. Ướp gà thái miếng với một nửa chỗ đó và nước mắm trong 15 phút.",
      ),
      localized(
        "Stir-fry the chicken in a very hot pan until browned at the edges.",
        "Xào gà trong chảo thật nóng cho đến khi xém cạnh.",
      ),
      localized(
        "Add the remaining lemongrass, garlic and chilli with a splash of water and toss until glossy.",
        "Cho sả, tỏi còn lại và ớt vào cùng chút nước, đảo đến khi bóng sánh.",
      ),
    ],
  },
  {
    slug: "trung-chien-ca-chua",
    name: localized("Tomato and Egg Stir-fry", "Trứng chiên cà chua"),
    description: localized(
      "Soft eggs folded into a sweet-tart tomato sauce and finished with scallion.",
      "Trứng mềm trộn vào sốt cà chua chua ngọt, rắc hành lá lúc cuối.",
    ),
    image: RECIPE_IMAGES["trung-chien-ca-chua"],
    minutes: 15,
    difficulty: "Easy",
    servings: 2,
    credit: VIETNAM_TRADITION,
    seasoning: [
      localized(
        "Use just a little fish sauce: the tomatoes already bring plenty of flavour.",
        "Chỉ nêm một chút nước mắm vì cà chua đã đủ đậm vị.",
      ),
      localized(
        "If the tomatoes are very sour, a tiny pinch of sugar balances them.",
        "Nếu cà chua quá chua, thêm một nhúm đường nhỏ để cân bằng.",
      ),
    ],
    ingredients: [
      { ingredientId: "egg", amount: "3" },
      { ingredientId: "tomato", amount: "3" },
      { ingredientId: "scallion", amount: "2" },
      { ingredientId: "fish-sauce", amount: "10 ml", optional: true },
    ],
    steps: [
      localized(
        "Beat the eggs with a pinch of salt and fry them softly, then set aside.",
        "Đánh trứng với một nhúm muối, chiên mềm rồi để riêng.",
      ),
      localized(
        "Cook the wedged tomatoes until they break down into a loose sauce.",
        "Xào cà chua cắt múi cho đến khi mềm nhừ thành sốt loãng.",
      ),
      localized(
        "Return the eggs to the pan, toss briefly and finish with sliced scallion.",
        "Cho trứng trở lại chảo, đảo nhanh và rắc hành lá thái nhỏ.",
      ),
    ],
  },
];