"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, User, Search, ShoppingBag, LogOut, Settings, Package, Heart } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { SearchDialog } from "@/components/search-dialog"
import { getPublishedCollections } from "@/actions/collection-actions"
import { getProductCategories } from "@/actions/product-actions"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [collections, setCollections] = useState<Array<{ name: string; slug: string; isNew?: boolean }>>([])
  const [featuredCollections, setFeaturedCollections] = useState<Array<{ name: string; href: string; image: string }>>(
    [],
  )
  const [categories, setCategories] = useState<Array<{ name: string; href: string }>>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const shopMenuRef = useRef<HTMLDivElement>(null)
  const shopLinkRef = useRef<HTMLAnchorElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userLinkRef = useRef<HTMLDivElement>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isShopPage = pathname.startsWith("/sklep")
  const isCollectionPage = pathname.startsWith("/kolekcje")
  const { openCart, totalItems } = useCart()
  const { user, signOut } = useAuth()

  // Determine if navbar should be white
  const shouldBeWhite = isScrolled || !isHomePage || isShopMenuOpen

  // Fetch collections from the database
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoadingCollections(true)
        const dbCollections = await getPublishedCollections()

        // Transform collections for the navbar
        const transformedCollections = dbCollections.map((collection) => ({
          name: collection.name,
          slug: collection.slug,
          isNew: new Date(collection.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000, // Is less than 30 days old
        }))

        setCollections(transformedCollections)

        // Set featured collections (first 5)
        const featured = dbCollections.slice(0, 5).map((collection) => ({
          name: collection.name,
          href: `/kolekcje/${collection.slug}`,
          image: collection.hero_image || "/diverse-fashion-collection.png",
        }))

        setFeaturedCollections(featured)
        setIsLoadingCollections(false)
      } catch (error) {
        console.error("Error fetching collections:", error)
        setIsLoadingCollections(false)
      }
    }

    fetchCollections()
  }, [])

  // Fetch product categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        // Get categories that have products
        const availableCategories = await getProductCategories()

        // Map category slugs to display names and URLs
        const categoryMap: Record<string, string> = {
          all: "Wszystkie produkty",
          koszulki: "Koszulki",
          "bluzy-z-kapturem": "Bluzy z kapturem",
          "bluzy-bez-kaptura": "Bluzy bez kaptura",
          longsleeve: "Longsleeve",
          koszule: "Koszule",
          spodnie: "Spodnie",
          szorty: "Szorty",
          kurtki: "Kurtki",
          akcesoria: "Akcesoria",
        }

        // Always include "all" category
        const transformedCategories = [{ name: "Wszystkie produkty", href: "/sklep" }]

        // Add other categories that have products
        availableCategories.forEach((category) => {
          if (category !== "all" && categoryMap[category]) {
            transformedCategories.push({
              name: categoryMap[category],
              href: `/sklep/${category}`,
            })
          }
        })

        setCategories(transformedCategories)
        setIsLoadingCategories(false)
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to showing all categories if there's an error
        setCategories([
          { name: "Wszystkie produkty", href: "/sklep" },
          { name: "Koszulki", href: "/sklep/koszulki" },
          { name: "Bluzy z kapturem", href: "/sklep/bluzy-z-kaptura" },
          { name: "Bluzy bez kaptura", href: "/sklep/bluzy-bez-kaptura" },
        ])
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

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

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userLinkRef.current &&
        !userLinkRef.current.contains(event.target as Node)
      ) {
        closeUserMenu()
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
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current)
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

  const openUserMenu = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current)
      userMenuTimeoutRef.current = null
    }
    setIsUserMenuOpen(true)
  }

  const closeUserMenu = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false)
    }, 200)
  }

  // Check if a category is active
  const isCategoryActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
    closeUserMenu()
  }

  // Common icon size and style for consistency
  const iconSize = 20
  const iconClass = `flex items-center justify-center w-[20px] h-[20px]`

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
                  alt="LORI"
                  width={150}
                  height={30}
                  className={`h-8 w-auto transition-all duration-500 ${shouldBeWhite ? "" : "filter invert"}`}
                />
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-6">
              <Link
                href="/instagram"
                className={`hidden md:flex items-center justify-center w-5 h-5 transition-colors duration-500 ${
                  shouldBeWhite ? "text-gray-800" : "text-white"
                } hover:opacity-80`}
              >
                <span className={iconClass}>
                  <Instagram size={iconSize} strokeWidth={1.5} />
                </span>
              </Link>
              <Link
                href="/facebook"
                className={`hidden md:flex items-center justify-center w-5 h-5 transition-colors duration-500 ${
                  shouldBeWhite ? "text-gray-800" : "text-white"
                } hover:opacity-80`}
              >
                <span className={iconClass}>
                  <Facebook size={iconSize} strokeWidth={1.5} />
                </span>
              </Link>

              {/* User account icon with dropdown */}
              <div ref={userLinkRef} className="relative" onMouseEnter={openUserMenu} onMouseLeave={closeUserMenu}>
                <button
                  className={`flex items-center justify-center w-5 h-5 transition-colors duration-500 ${
                    shouldBeWhite ? "text-gray-800" : "text-white"
                  } hover:opacity-80`}
                  aria-label="Konto użytkownika"
                >
                  <span className={iconClass}>
                    <User size={iconSize} strokeWidth={1.5} />
                  </span>
                </button>

                {/* User dropdown menu */}
                <div
                  ref={userMenuRef}
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 transition-all duration-200 ${
                    isUserMenuOpen ? "opacity-100 transform-none" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  onMouseEnter={openUserMenu}
                  onMouseLeave={closeUserMenu}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.user_metadata?.name || user.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Moje konto
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Zamówienia
                        </Link>
                        <Link
                          href="/account?tab=favorites"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Ulubione
                        </Link>
                        <Link
                          href="/account?tab=settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Ustawienia
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Wyloguj się
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="py-1">
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          Zaloguj się
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeUserMenu}
                        >
                          Zarejestruj się
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className={`flex items-center justify-center w-5 h-5 transition-colors duration-500 ${
                  shouldBeWhite ? "text-gray-800" : "text-white"
                } hover:opacity-80`}
                aria-label="Search"
              >
                <span className={iconClass}>
                  <Search size={iconSize} strokeWidth={1.5} />
                </span>
              </button>
              <button
                onClick={openCart}
                className={`relative flex items-center justify-center w-5 h-5 transition-colors duration-500 ${
                  shouldBeWhite ? "text-gray-800" : "text-white"
                } hover:opacity-80`}
                aria-label="Koszyk"
              >
                <span className={iconClass}>
                  <ShoppingBag size={iconSize} strokeWidth={1.5} />
                </span>
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
                {isLoadingCategories ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                    ))}
                  </div>
                ) : categories.length > 0 ? (
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link
                          href={category.href}
                          className={`text-sm hover:underline transition-colors duration-300 ${
                            isCategoryActive(category.href)
                              ? "text-black font-medium"
                              : "text-gray-600 hover:text-black"
                          }`}
                          onClick={closeMenu}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Brak dostępnych kategorii.</p>
                )}
              </div>

              {/* Collections */}
              <div className="w-1/6 pr-8">
                <h3 className="font-medium text-gray-900 mb-4">Kolekcje</h3>
                {isLoadingCollections ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
                    ))}
                  </div>
                ) : collections.length > 0 ? (
                  <ul className="space-y-2">
                    {collections.map((collection) => (
                      <li key={collection.name} className="flex items-center">
                        <Link
                          href={`/kolekcje/${collection.slug}`}
                          className={`text-sm hover:underline transition-colors duration-300 ${
                            isCategoryActive(`/kolekcje/${collection.slug}`)
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
                ) : (
                  <p className="text-sm text-gray-500">W tej chwili nie ma żadnych kolekcji.</p>
                )}
              </div>

              {/* Featured Collections with Images */}
              <div className="w-4/6">
                {isLoadingCollections ? (
                  // Loading skeleton for featured collections
                  <div className="grid grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded"></div>
                    ))}
                  </div>
                ) : featuredCollections.length > 0 ? (
                  <div className="grid grid-cols-5 gap-4">
                    {featuredCollections.map((collection) => (
                      <Link key={collection.name} href={collection.href} className="group relative" onClick={closeMenu}>
                        <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                          <Image
                            src={collection.image || "/placeholder.svg?height=400&width=300&query=fashion collection"}
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
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Brak kolekcji do wyświetlenia.</p>
                  </div>
                )}
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
