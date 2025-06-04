"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function Footer() {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showReturnsModal, setShowReturnsModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  return (
    <>
      <footer className="bg-white py-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            {/* Logo and Newsletter Section */}
            <div className="mb-10 md:mb-0 md:w-1/3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">LORI</h2>
              </div>
              <p className="text-sm mb-6 max-w-md">
                Subskrybuj aby na bieżąco otrzymywać zapowiedzi, informacje o nowych kolekcjach i przecenach.
              </p>
              <div className="space-y-4">
                <Input type="text" placeholder="Imię" className="border-b border-gray-300 rounded-none px-3" />
                <Input type="email" placeholder="Email" className="border-b border-gray-300 rounded-none px-3" />
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Subskrybuj <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-black hover:text-gray-600">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-black hover:text-gray-600">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            {/* Site Map Section */}
            <div className="mb-10 md:mb-0">
              <h3 className="font-semibold text-base mb-4">Mapa strony</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-sm hover:underline">
                    Strona Główna
                  </Link>
                </li>
                <li>
                  <Link href="/sklep" className="text-sm hover:underline">
                    Sklep
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="text-sm hover:underline">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service Section */}
            <div>
              <h3 className="font-semibold text-base mb-4">Obsługa klienta</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowDeliveryModal(true)
                    }}
                  >
                    Dostawa i płatność
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowReturnsModal(true)
                    }}
                  >
                    Zwroty i reklamacje
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowTermsModal(true)
                    }}
                  >
                    Regulamin
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowFaqModal(true)
                    }}
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowPrivacyModal(true)
                    }}
                  >
                    Polityka prywatności
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Delivery and Payment Modal */}
      <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dostawa i płatność</DialogTitle>
            <DialogDescription>Informacje dotyczące metod dostawy i dostępnych form płatności.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <p>
              Oferujemy szybką i bezpieczną dostawę na terenie całej Polski. Standardowy czas dostawy wynosi 2-3 dni
              robocze. Koszt dostawy zależy od wybranej metody i wagi zamówienia.
            </p>
            <p>Akceptujemy następujące formy płatności:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Przelewy24 (szybkie przelewy, BLIK)</li>
              <li>PayPal</li>
              <li>Karty płatnicze (Visa, MasterCard)</li>
            </ul>
            <p>Wszystkie transakcje są szyfrowane i bezpieczne.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Returns and Complaints Modal */}
      <Dialog open={showReturnsModal} onOpenChange={setShowReturnsModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Zwroty i reklamacje</DialogTitle>
            <DialogDescription>Informacje dotyczące procedury zwrotów i składania reklamacji.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <p>
              Masz prawo do zwrotu zakupionego towaru w ciągu 14 dni od daty otrzymania przesyłki, bez podawania
              przyczyny. Produkt musi być w stanie nienaruszonym, z oryginalnymi metkami i opakowaniem.
            </p>
            <p>Aby dokonać zwrotu:</p>
            <ol className="list-decimal list-inside ml-4">
              <li>Wypełnij formularz zwrotu dostępny na naszej stronie.</li>
              <li>Dołącz formularz do zwracanego produktu.</li>
              <li>Wyślij paczkę na adres podany w formularzu.</li>
            </ol>
            <p>
              W przypadku reklamacji prosimy o kontakt z naszym działem obsługi klienta, przedstawiając opis problemu
              oraz zdjęcia uszkodzonego produktu. Rozpatrzymy Twoją reklamację w ciągu 14 dni.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Regulamin</DialogTitle>
            <DialogDescription>Ogólne warunki korzystania z serwisu i dokonywania zakupów.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <p className="font-semibold">1. Postanowienia Ogólne</p>
            <p>
              Niniejszy regulamin określa zasady korzystania ze sklepu internetowego Lori, dostępnego pod adresem [adres
              strony]. Sklep prowadzony jest przez [Nazwa Firmy], z siedzibą w [Adres Firmy], NIP: [NIP].
            </p>
            <p className="font-semibold">2. Składanie Zamówień</p>
            <p>
              Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu. W celu złożenia zamówienia należy dodać
              wybrane produkty do koszyka, a następnie postępować zgodnie z instrukcjami na stronie.
            </p>
            <p className="font-semibold">3. Płatności</p>
            <p>
              Akceptujemy płatności za pośrednictwem Przelewy24, PayPal oraz kart płatniczych. Płatność musi zostać
              zaksięgowana przed wysyłką towaru.
            </p>
            <p className="font-semibold">4. Dostawa</p>
            <p>
              Dostawa realizowana jest na terenie Polski. Czas dostawy wynosi od 2 do 5 dni roboczych. Koszty dostawy są
              podane w sekcji "Dostawa i płatność".
            </p>
            <p className="font-semibold">5. Zwroty i Reklamacje</p>
            <p>Szczegółowe informacje dotyczące zwrotów i reklamacji znajdują się w sekcji "Zwroty i reklamacje".</p>
            <p className="font-semibold">6. Ochrona Danych Osobowych</p>
            <p>
              Dane osobowe Klientów są przetwarzane zgodnie z obowiązującymi przepisami prawa, w tym RODO. Szczegóły w
              "Polityce prywatności".
            </p>
            <p className="font-semibold">7. Postanowienia Końcowe</p>
            <p>W sprawach nieuregulowanych niniejszym regulaminem mają zastosowanie przepisy prawa polskiego.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Modal */}
      <Dialog open={showFaqModal} onOpenChange={setShowFaqModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Najczęściej Zadawane Pytania (FAQ)</DialogTitle>
            <DialogDescription>Odpowiedzi na najczęściej zadawane pytania dotyczące naszego sklepu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <p className="font-semibold">P: Jak mogę złożyć zamówienie?</p>
            <p>
              O: Zamówienie możesz złożyć, dodając produkty do koszyka i przechodząc do kasy. Postępuj zgodnie z
              instrukcjami na stronie, aby sfinalizować zakup.
            </p>
            <p className="font-semibold">P: Jakie są dostępne metody płatności?</p>
            <p>
              O: Akceptujemy płatności za pośrednictwem Przelewy24 (szybkie przelewy, BLIK), PayPal oraz kart
              płatniczych (Visa, MasterCard).
            </p>
            <p className="font-semibold">P: Jaki jest czas dostawy?</p>
            <p>
              O: Standardowy czas dostawy na terenie Polski wynosi 2-3 dni robocze. Szczegółowe informacje znajdziesz w
              sekcji "Dostawa i płatność".
            </p>
            <p className="font-semibold">P: Czy mogę zwrócić zakupiony produkt?</p>
            <p>
              O: Tak, masz prawo do zwrotu towaru w ciągu 14 dni od daty otrzymania przesyłki. Więcej informacji w
              sekcji "Zwroty i reklamacje".
            </p>
            <p className="font-semibold">P: Jak skontaktować się z obsługą klienta?</p>
            <p>
              O: Możesz skontaktować się z nami poprzez formularz kontaktowy na stronie "Kontakt" lub wysyłając email na
              [adres email].
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Polityka Prywatności</DialogTitle>
            <DialogDescription>Informacje dotyczące przetwarzania Twoich danych osobowych.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <p className="font-semibold">1. Administrator Danych Osobowych</p>
            <p>Administratorem Twoich danych osobowych jest [Nazwa Firmy], z siedzibą w [Adres Firmy], NIP: [NIP].</p>
            <p className="font-semibold">2. Cel i Zakres Przetwarzania Danych</p>
            <p>
              Twoje dane osobowe są przetwarzane w celu realizacji zamówień, obsługi konta użytkownika, a także w celach
              marketingowych (jeśli wyraziłeś na to zgodę). Zbieramy dane takie jak imię, nazwisko, adres email, adres
              dostawy, numer telefonu.
            </p>
            <p className="font-semibold">3. Podstawa Prawna Przetwarzania</p>
            <p>
              Przetwarzanie danych odbywa się na podstawie Twojej zgody, w celu wykonania umowy (realizacja zamówienia)
              lub w oparciu o prawnie uzasadniony interes administratora.
            </p>
            <p className="font-semibold">4. Odbiorcy Danych</p>
            <p>
              Twoje dane mogą być udostępniane podmiotom świadczącym usługi kurierskie, operatorom płatności oraz innym
              podmiotom współpracującym z nami w celu realizacji usług.
            </p>
            <p className="font-semibold">5. Twoje Prawa</p>
            <p>
              Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do
              przenoszenia danych, prawo wniesienia sprzeciwu oraz prawo do cofnięcia zgody w dowolnym momencie.
            </p>
            <p className="font-semibold">6. Okres Przechowywania Danych</p>
            <p>
              Dane są przechowywane przez okres niezbędny do realizacji celów, dla których zostały zebrane, a także
              przez okres wynikający z przepisów prawa (np. podatkowych).
            </p>
            <p className="font-semibold">7. Pliki Cookies</p>
            <p>
              Nasza strona wykorzystuje pliki cookies w celu poprawy funkcjonalności i personalizacji treści. Szczegóły
              dotyczące plików cookies znajdziesz w naszej Polityce Cookies.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
