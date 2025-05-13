"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, User, Search, ShoppingBag, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { SearchDialog } from "@/components/search-dialog"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const shopMenuRef = useRef<HTMLDivElement>(null)
  const shopLinkRef = useRef<HTMLAnchorElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isShopPage = pathname.startsWith("/sklep")
  const isCollectionPage = pathname.startsWith("/kolekcje")
  const { openCart, totalItems } = useCart()

  // Determine if navbar should be white
  const shouldBeWhite = isScrolled || !isHomePage || isShopMenuOpen

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section (assuming hero height is around 100vh)
      const heroHeight = window.innerHeight
      setIsScrolled(window.scrollY > heroHeight * 0.8)
    }

    // Add scroll event listener only on homepage
    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
      // Initial check
      handleScroll()
    } else {
      // On other pages, always set isScrolled to true to show background
      setIsScrolled(true)
    }

    // Clean up
    return () => {
      if (isHomePage) {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [isHomePage])

  // Handle clicks outside of the shop menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopMenuRef.current &&
        !shopMenuRef.current.contains(event.target as Node) &&
        shopLinkRef.current &&
        !shopLinkRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current)
      }
    }
  }, [])

  const openMenu = () => {
    // Clear any existing timeout
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
      menuTimeoutRef.current = null
    }
    setIsShopMenuOpen(true)
  }

  const closeMenu = () => {
    setIsShopMenuOpen(false)
  }

  const categories = [
    { name: "Wszystkie produkty", href: "/sklep" },
    { name: "Koszulki", href: "/sklep/koszulki" },
    { name: "Bluzy z kapturem", href: "/sklep/bluzy-z-kapturem" },
    { name: "Bluzy bez kaptura", href: "/sklep/bluzy-bez-kaptura" },
    { name: "Longsleeve", href: "/sklep/longsleeve" },
    { name: "Koszule", href: "/sklep/koszule" },
    { name: "Spodnie", href: "/sklep/spodnie" },
    { name: "Szorty", href: "/sklep/szorty" },
    { name: "Kurtki", href: "/sklep/kurtki" },
    { name: "Akcesoria", href: "/sklep/akcesoria" },
  ]

  const collections = [
    { name: "Fils de L'esthétique", href: "/kolekcje/fils-de-lesthetique", isNew: true },
    { name: "Earth Day", href: "/kolekcje/earth-day", isNew: false },
    { name: "Pass me the Love", href: "/kolekcje/pass-me-the-love", isNew: false },
    { name: "L'art du Lori", href: "/kolekcje/lart-du-lori", isNew: false },
    { name: "Metal Tag", href: "/kolekcje/metal-tag", isNew: false },
    { name: "Summer Shades", href: "/kolekcje/summer-shades", isNew: false },
    { name: "Pants Reinvented", href: "/kolekcje/pants-reinvented", isNew: false },
    { name: "Blanks", href: "/kolekcje/blanks", isNew: false },
    { name: "Daily Couture", href: "/kolekcje/daily-couture", isNew: false },
    { name: "Chain Stitch", href: "/kolekcje/chain-stitch", isNew: false },
    { name: "Starsze kolekcje", href: "/kolekcje/archive", isNew: false },
  ]

  const featuredCollections = [
    {
      name: "Fils de L'esthétique",
      href: "/kolekcje/fils-de-lesthetique",
      image: "/fashion-model-black-outfit.png",
    },
    {
      name: "Earth Day",
      href: "/kolekcje/earth-day",
      image: "/placeholder.svg?key=chfzu",
    },
    {
      name: "L'art du Lori",
      href: "/kolekcje/lart-du-lori",
      image: "/placeholder.svg?key=pia9f",
    },
    {
      name: "Metal Tag",
      href: "/kolekcje/metal-tag",
      image: "/placeholder.svg?key=bdgza",
    },
    {
      name: "Summer Shades",
      href: "/kolekcje/summer-shades",
      image: "/placeholder.svg?key=tf16v",
    },
  ]

  // Check if a category is active
  const isCategoryActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          shouldBeWhite ? "bg-white border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors duration-500 ${
                  shouldBeWhite ? "text-black" : "text-white"
                } hover:opacity-80 ${pathname === "/" ? "font-semibold" : ""}`}
              >
                Strona Główna
              </Link>
              <div className="relative">
                <Link
                  ref={shopLinkRef}
                  href="/sklep"
                  className={`text-sm font-medium transition-colors duration-500 ${
                    shouldBeWhite ? "text-black" : "text-white"
                  } hover:opacity-80 ${isShopPage ? "font-semibold" : ""}`}
                  onMouseEnter={openMenu}
                  onClick={(e) => {
                    if (isShopMenuOpen) {
                      e.preventDefault()
                      closeMenu()
                    }
                  }}
                >
                  Sklep
                </Link>
              </div>
              <Link
                href="/kontakt"
                className={`text-sm font-medium transition-colors duration-500 ${
                  shouldBeWhite ? "text-black" : "text-white"
                } hover:opacity-80 ${pathname.startsWith("/kontakt") ? "font-semibold" : ""}`}
              >
                Kontakt
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className={`md:hidden transition-colors duration-500 ${shouldBeWhite ? "text-black" : "text-white"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo (centered) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/">
                <Image
                  src="/images/lori.webp"
                  alt="PHENOTYPE"
                  width={150}
                  height={30}
                  className={`h-8 w-auto transition-all duration-500 ${shouldBeWhite ? "" : "filter invert"}`}
                />
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/instagram"
                className={`hidden md:block transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="/facebook"
                className={`hidden md:block transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="/admin"
                className={`transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
              >
                <Settings size={20} />
              </Link>
              <Link
                href="/account"
                className={`transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
              >
                <User size={20} />
              </Link>
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <button
                onClick={openCart}
                className={`relative transition-colors duration-500 ${shouldBeWhite ? "text-gray-800" : "text-white"} hover:opacity-80`}
                aria-label="Open cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 ${shouldBeWhite ? "bg-white" : "bg-black bg-opacity-70"}`}>
              <nav className="flex flex-col space-y-4 p-4">
                <Link
                  href="/"
                  className={`text-sm font-medium ${shouldBeWhite ? "text-black" : "text-white"} hover:opacity-80 ${
                    pathname === "/" ? "font-semibold" : ""
                  }`}
                >
                  Strona Główna
                </Link>
                <Link
                  href="/sklep"
                  className={`text-sm font-medium ${shouldBeWhite ? "text-black" : "text-white"} hover:opacity-80 ${
                    isShopPage ? "font-semibold" : ""
                  }`}
                >
                  Sklep
                </Link>
                <Link
                  href="/kontakt"
                  className={`text-sm font-medium ${shouldBeWhite ? "text-black" : "text-white"} hover:opacity-80 ${
                    pathname.startsWith("/kontakt") ? "font-semibold" : ""
                  }`}
                >
                  Kontakt
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* Simplified Mega Menu with gentle animations */}
        <div
          ref={shopMenuRef}
          className={`absolute left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-100 transition-all duration-500 ease-out ${
            isShopMenuOpen ? "opacity-100 transform-none" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          style={{
            height: isShopMenuOpen ? "auto" : "0",
            overflow: "hidden",
            transitionProperty: "opacity, transform, height",
          }}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <div className="container mx-auto py-8">
            <div className="flex">
              {/* Categories */}
              <div className="w-1/6 pr-8">
                <h3 className="font-medium text-gray-900 mb-4">Kategorie</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={category.href}
                        className={`text-sm hover:underline transition-colors duration-300 ${
                          isCategoryActive(category.href) ? "text-black font-medium" : "text-gray-600 hover:text-black"
                        }`}
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collections */}
              <div className="w-1/6 pr-8">
                <h3 className="font-medium text-gray-900 mb-4">Kolekcje</h3>
                <ul className="space-y-2">
                  {collections.slice(0, 11).map((collection) => (
                    <li key={collection.name} className="flex items-center">
                      <Link
                        href={collection.href}
                        className={`text-sm hover:underline transition-colors duration-300 ${
                          isCategoryActive(collection.href)
                            ? "text-black font-medium"
                            : "text-gray-600 hover:text-black"
                        }`}
                        onClick={closeMenu}
                      >
                        {collection.name}
                      </Link>
                      {collection.isNew && <span className="ml-2 text-xs text-red-500 font-medium">NEW!</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Collections with Images */}
              <div className="w-4/6">
                <div className="grid grid-cols-5 gap-4">
                  {featuredCollections.map((collection) => (
                    <Link key={collection.name} href={collection.href} className="group relative" onClick={closeMenu}>
                      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          fill
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            isCategoryActive(collection.href)
                              ? "bg-black bg-opacity-40"
                              : "bg-black bg-opacity-20 group-hover:bg-opacity-30"
                          }`}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4
                            className={`text-sm font-medium text-white ${
                              isCategoryActive(collection.href) ? "underline" : ""
                            }`}
                          >
                            {collection.name}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
