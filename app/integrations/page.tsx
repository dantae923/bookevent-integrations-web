"use client"

import { useState, useMemo, useEffect } from "react"
import { Event } from "../data/integrations"
import IntegrationGrid from "./components/IntegrationGrid"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import CategoryFilter from "./components/CategoryFilter"

const ITEMS_PER_PAGE = 30

export default function IntegrationsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch("/api/integrations")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("API 오류:", err))

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("카테고리 불러오기 실패", err))
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const title = event.book_title ?? ""
      const goods = event.special_goods ?? ""
      const categoryMatch = selectedCategory === "All" || event.site === selectedCategory
      return (
        categoryMatch &&
        (title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          goods.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold">📚 도서 행사 모아보기</h1>
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query)
              setCurrentPage(1)
            }}
          />
        </div>
        <div className="flex-1 overflow-auto px-4 md:px-6">
          <IntegrationGrid integrations={paginatedEvents} />
        </div>
        <div className="p-4 md:p-6 border-t">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </main>
    </div>
  )
}
