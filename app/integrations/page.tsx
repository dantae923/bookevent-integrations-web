"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Event } from "../data/integrations"
import IntegrationGrid from "./components/IntegrationGrid"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import CategoryFilter from "./components/CategoryFilter"

const ITEMS_PER_PAGE = 30

export default function IntegrationsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>(["전체"])
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ 먼저 모바일 여부 확인
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator as any).userAgentData?.mobile === true

    if (isMobile) {
      // alert("📱모바일 화면으로 전환됩니다.")
      router.replace("/mobile")
      return  // 👈 아래 fetch 로직 실행 방지
    }

    fetch("/api/integrations")
      .then(res => res.json())
      .then(data => {
        // 시작일 추출 함수
        const extractStartDate = (period: string): Date | null => {
          const match = period?.match(/^(\d{4}\/\d{2}\/\d{2})/)
          return match ? new Date(match[1]) : null
        }

        // 정렬 적용
        const sorted = data.sort((a: Event, b: Event) => {
          const dateA = extractStartDate(a.period ?? "")
          const dateB = extractStartDate(b.period ?? "")

          // 1. 시작일 내림차순
          if (dateA && dateB) return dateB.getTime() - dateA.getTime()
          if (dateA && !dateB) return -1
          if (!dateA && dateB) return 1

          // 2. 사이트 가나다순
          const siteCompare = a.site.localeCompare(b.site, "ko-KR")
          if (siteCompare !== 0) return siteCompare

          // 3. 이벤트명 가나다순
          return a.event_title.localeCompare(b.event_title, "ko-KR")
        })
        setEvents(sorted)
      })
      .catch(err => console.error("API 오류:", err))

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: string, b: string) => {
          if (a === "전체") return -1
          if (b === "전체") return 1
          return a.localeCompare(b, 'ko-KR')
        })
        setCategories(sorted)
      })
      .catch(err => console.error("카테고리 불러오기 실패", err))

      // ✅ IP 기록 (사이트 방문 카운트용)
    fetch("/api/log-visit")
      .then(res => res.json())
      .then(data => {
        if (data.status !== "ok") {
          console.warn("방문자 기록 실패:", data)
        }
      })
    .catch(err => console.error("IP 추적 오류:", err))
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = event.event_title ?? ""
      const categoryMatch = selectedCategory === "전체" || event.site === selectedCategory
      return (
        categoryMatch &&
        title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [events, selectedCategory, searchQuery])

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) => {
          setSelectedCategory(category)
          setCurrentPage(1)
        }}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 space-y-4">
          <h1 className="text-2xl font-bold caret-transparent">📚 특전바로가기</h1>
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="flex-1 overflow-auto px-4 md:px-6 outline-none">
          <IntegrationGrid integrations={paginatedEvents} />
        </div>
        <div className="p-4 md:p-6 border-t">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </main>
    </div>
  )
}
