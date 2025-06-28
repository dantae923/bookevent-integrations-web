"use client"

import { useState } from "react"
import { Search, Calendar, BookOpen, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const filters = ["전체", "신간", "사인회", "북토크", "전시회"]

  const mockEvents = [
    {
      id: 1,
      title: "김영하 작가 신작 『작별하지 않는다』 출간 기념 사인회",
      date: "2024.01.15",
      type: "사인회",
      image: "/placeholder.svg?height=120&width=80",
      isLiked: false,
    },
    {
      id: 2,
      title: "정유정 작가와 함께하는 『완전한 행복』 북토크",
      date: "2024.01.18",
      type: "북토크",
      image: "/placeholder.svg?height=120&width=80",
      isLiked: true,
    },
    {
      id: 3,
      title: "2024 신춘문예 당선작 전시회",
      date: "2024.01.20",
      type: "전시회",
      image: "/placeholder.svg?height=120&width=80",
      isLiked: false,
    },
  ]

  const filteredEvents = mockEvents.filter(
    (event) =>
      (selectedFilter === "전체" || event.type === selectedFilter) &&
      (searchQuery === "" || event.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={`whitespace-nowrap ${
                  selectedFilter === filter ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Event List */}
      <div className="px-4 py-4 space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-20 object-cover rounded border border-gray-200"
                    />
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 mb-1">
                        {event.type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Heart
                            className={`w-4 h-4 ${event.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                          />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{event.title}</h3>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
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

      {/* Bottom Navigation Placeholder */}
      <div className="h-20"></div>
    </div>
  )
}
