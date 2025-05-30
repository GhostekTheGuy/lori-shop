// Mock products data for admin panel
export const mockProducts = [
  {
    id: "1",
    name: "Cream Cotton T-shirt",
    salePrice: "95,20 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    stockStatus: "in-stock" as const,
    category: "koszulki",
    description: "Klasyczny t-shirt z wysokiej jakości bawełny w kolorze kremowym.",
  },
  {
    id: "2",
    name: "Light Gray Cotton T-shirt",
    salePrice: "95,20 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-2.png",
    stockStatus: "low-stock" as const,
    stockQuantity: 3,
    category: "koszulki",
    description: "Klasyczny t-shirt z wysokiej jakości bawełny w kolorze jasnoszarym.",
  },
  {
    id: "3",
    name: "Beige Cotton Hoodie",
    salePrice: "219,00 zł",
    originalPrice: "219,00 zł",
    image: "/images/beige-hoodie.webp",
    tag: "NEW",
    stockStatus: "in-stock" as const,
    category: "bluzy-z-kapturem",
    description: "Wygodna bluza z kapturem w kolorze beżowym, wykonana z miękkiej bawełny.",
  },
  {
    id: "4",
    name: "Mauve Cotton Hoodie",
    salePrice: "219,00 zł",
    originalPrice: "219,00 zł",
    image: "/images/mauve-hoodie.webp",
    tag: "NEW",
    stockStatus: "in-stock" as const,
    category: "bluzy-z-kapturem",
    description: "Wygodna bluza z kapturem w kolorze liliowym, wykonana z miękkiej bawełny.",
  },
  {
    id: "5",
    name: "Black Cotton Pants",
    salePrice: "159,20 zł",
    originalPrice: "199,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    stockStatus: "sold-out" as const,
    category: "spodnie",
    description: "Wygodne spodnie z bawełny w kolorze czarnym.",
  },
  {
    id: "6",
    name: "Navy Blue Longsleeve",
    salePrice: "129,00 zł",
    originalPrice: "129,00 zł",
    image: "/images/product-2.png",
    stockStatus: "in-stock" as const,
    category: "longsleeve",
    description: "Longsleeve z wysokiej jakości bawełny w kolorze granatowym.",
  },
  {
    id: "7",
    name: "White Cotton Shirt",
    salePrice: "139,20 zł",
    originalPrice: "174,00 zł",
    image: "/images/product-1.png",
    tag: "SALE",
    stockStatus: "low-stock" as const,
    stockQuantity: 2,
    category: "koszule",
    description: "Klasyczna biała koszula z wysokiej jakości bawełny.",
  },
  {
    id: "8",
    name: "Beige Shorts",
    salePrice: "119,00 zł",
    originalPrice: "119,00 zł",
    image: "/images/product-2.png",
    stockStatus: "in-stock" as const,
    category: "szorty",
    description: "Wygodne szorty w kolorze beżowym, idealne na lato.",
  },
]

// Helper function to get a product by ID
export function getProductById(id: string) {
  return mockProducts.find((product) => product.id === id) || null
}

// If there's a getCollectionWithProducts function that filters by published, update it
// For example, if there's code like this:
/*
const { data: products, error: productDetailsError } = await supabase
  .from("products")
  .select("*")
  .in("id", productIds)
  .eq("published", true)
*/
// Change it to:
/*
const { data: products, error: productDetailsError } = await supabase
  .from("products")
  .select("*")
  .in("id", productIds)
*/
