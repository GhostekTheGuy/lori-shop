import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"

export default function ShopPage() {
  // Mock products data - in a real app, this would come from a database or API
  const products = [
    {
      id: "1",
      name: "Cream Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
    },
    {
      id: "2",
      name: "Light Gray Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      tag: undefined,
    },
    {
      id: "3",
      name: "Black Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
    },
    {
      id: "4",
      name: "White Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      tag: undefined,
    },
    {
      id: "5",
      name: "Navy Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
    },
    {
      id: "6",
      name: "Beige Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      tag: undefined,
    },
    {
      id: "7",
      name: "Olive Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-1.png",
      tag: "SALE",
    },
    {
      id: "8",
      name: "Burgundy Cotton T-shirt",
      salePrice: "95,20 zł",
      originalPrice: "119,00 zł",
      image: "/images/product-2.png",
      tag: undefined,
    },
  ]

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sklep</h1>
          <p className="text-gray-600">Wszystkie produkty</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="border-b pb-4 mb-4">
              <h2 className="font-medium mb-3">Filtry</h2>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="mr-2">
                  Nowości
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  Promocje
                </Button>
                <Button variant="outline" size="sm">
                  Bestsellery
                </Button>
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-3">Kategorie</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/sklep/koszulki" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Koszulki
                  </a>
                </li>
                <li>
                  <a href="/sklep/bluzy-z-kapturem" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Bluzy z kapturem
                  </a>
                </li>
                <li>
                  <a href="/sklep/bluzy-bez-kaptura" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Bluzy bez kaptura
                  </a>
                </li>
                <li>
                  <a href="/sklep/longsleeve" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Longsleeve
                  </a>
                </li>
                <li>
                  <a href="/sklep/koszule" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Koszule
                  </a>
                </li>
                <li>
                  <a href="/sklep/spodnie" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Spodnie
                  </a>
                </li>
                <li>
                  <a href="/sklep/szorty" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Szorty
                  </a>
                </li>
                <li>
                  <a href="/sklep/kurtki" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Kurtki
                  </a>
                </li>
                <li>
                  <a href="/sklep/akcesoria" className="text-sm text-gray-600 hover:text-black hover:underline">
                    Akcesoria
                  </a>
                </li>
              </ul>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-3">Rozmiar</h3>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button key={size} variant="outline" size="sm" className="h-8">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Cena</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Od"
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Do"
                  className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  salePrice={product.salePrice}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  tag={product.tag}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
