"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Event } from "../data/integrations"
import { Search, Calendar, BookOpen, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const ITEMS_PER_PAGE = 20

export default function Page() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>(["전체"])
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator as any).userAgentData?.mobile === true

    if (!isMobile) {
      router.replace("/integrations")
      return
    }

    fetch("/api/integrations")
      .then(res => res.json())
      .then(data => {
        const extractStartDate = (period: string): Date | null => {
          const match = period?.match(/^(\d{4}\/\d{2}\/\d{2})/)
          return match ? new Date(match[1]) : null
        }

        const sorted = data.sort((a: Event, b: Event) => {
          const dateA = extractStartDate(a.period ?? "")
          const dateB = extractStartDate(b.period ?? "")

          if (dateA && dateB) return dateB.getTime() - dateA.getTime()
          if (dateA && !dateB) return -1
          if (!dateA && dateB) return 1

          const siteCompare = a.site.localeCompare(b.site, "ko-KR")
          if (siteCompare !== 0) return siteCompare

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
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">국내 도서 특전행사</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="도서명을 입력해주세요"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map((filter) => (
            <Button
              key={filter}
              variant={selectedCategory === filter ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(filter)
                setCurrentPage(1)
              }}
              className={`whitespace-nowrap ${
                selectedCategory === filter ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Event List */}
      <div className="px-4 py-4 space-y-4">
        {paginatedEvents.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
          </div>
        ) : (
          paginatedEvents.map((event) => (
            <Card key={event.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.event_title}
                      className="w-16 h-20 object-cover rounded border border-gray-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 mb-1">
                        {event.site}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Heart className={`w-4 h-4 ${event.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{event.event_title}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            size="sm"
            variant={currentPage === pageNum ? "default" : "outline"}
            onClick={() => setCurrentPage(pageNum)}
            className="px-3"
          >
            {pageNum}
          </Button>
        ))}
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="h-20"></div>
    </div>
  )
}
