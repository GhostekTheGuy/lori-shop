"use client"

import { useEffect, useState } from "react"

export function AnnouncementBar() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const targetDate = new Date("2025-05-18T00:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      const d = Math.floor(distance / (1000 * 60 * 60 * 24))
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((distance % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-red-500 text-white">
      <div className="flex items-center justify-center h-9">
        <p className="text-sm">
          Świętujemy 12-lecie Phenotype! Nowa kolekcja już online – z rabatami od 20% do 70% na nowości i klasyki!
          <span className="ml-2">
            {days} Dni {hours} Godzin {minutes} Minut {seconds} Sekund
          </span>
        </p>
      </div>
    </div>
  )
}
