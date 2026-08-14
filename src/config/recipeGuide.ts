import type { Recipe } from "@/lib/mdx";

/**
 * The /recipes index lists these eight drinks (copy source's "Drink Recipes"
 * section), but none of them have ingredients or method written yet — the
 * copy source's own open item #2. Rather than invent recipes, every card
 * here links out to the external guide instead of an internal detail page.
 *
 * `ingredients`/`method` are empty because RecipeCard/RecipeCarousel expect
 * the `Recipe` shape but never read those two fields when `guideHref` is set
 * — nothing renders them off this list.
 */
export const RECIPE_GUIDE_URL = "https://canva.link/ae7kw509iuzlt1p";

export const RECIPE_GUIDE_ITEMS: Recipe[] = [
  {
    slug: "traditional-ceremonial-cacao",
    title: "Traditional Ceremonial Cacao",
    mood: "The pour it all starts with",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 1,
    placeholder: false,
  },
  {
    slug: "cacao-with-milk",
    title: "Cacao with Milk",
    mood: "Softened, familiar",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 2,
    placeholder: false,
  },
  {
    slug: "iced-cacao",
    title: "Iced Cacao",
    mood: "The ritual, chilled",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 3,
    placeholder: false,
  },
  {
    slug: "ginger-orange-cacao",
    title: "Ginger & Orange Cacao",
    mood: "Brightened and warming at once",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 4,
    placeholder: false,
  },
  {
    slug: "chai-cacao",
    title: "Chai Cacao",
    mood: "Spiced, layered",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 5,
    placeholder: false,
  },
  {
    slug: "vanilla-bean-cacao",
    title: "Vanilla Bean Cacao",
    mood: "Round and warm",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 6,
    placeholder: false,
  },
  {
    slug: "mayan-chili-cacao",
    title: "Mayan Chili Cacao",
    mood: "A nod to where this all began",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 7,
    placeholder: false,
  },
  {
    slug: "rose-infused-cacao",
    title: "Rose-Infused Cacao",
    mood: "Fragranced and aromatic",
    ingredients: [],
    method: [],
    image: null,
    featured: false,
    order: 8,
    placeholder: false,
  },
];
