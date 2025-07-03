import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

type SearchBarProps = {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
    inputRef.current?.focus()
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="도서명을 입력해주세요."
        className="w-full h-10 pl-10 pr-10" // 오른쪽 여백 확보
        value={query}
        onChange={handleChange}
        ref={inputRef}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
