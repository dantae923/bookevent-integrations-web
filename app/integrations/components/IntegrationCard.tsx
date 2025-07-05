import { useState } from "react"
import { Calendar, ExternalLink, Globe } from "lucide-react"

type Event = {
  image: string
  event_title: string
  site: string
  period: string
  link: string
  created_time: string
}

type IntegrationCardProps = {
  integration: Event
}

const isNewEvent = (created_time: string) => {
  const createdDate = new Date(created_time)
  const now = new Date()
  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    
  return diffInDays <= 7
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const [showZoomButton, setShowZoomButton] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* 카드 */}
      <div className="hover:shadow-lg transition-all duration-300 group h-full border border-gray-300 rounded-lg w-64 bg-white relative caret-transparent">
        <div
          className="p-4 flex flex-col h-full space-y-2 relative"
          onMouseEnter={() => setShowZoomButton(true)}
          onMouseLeave={() => setShowZoomButton(false)}
        >
          {/* 이미지 영역 */}
          <div className="relative" contentEditable={false}>
            <img
              src={integration.image}
              alt={integration.event_title}
              className="w-full h-32 object-contain rounded bg-white select-none pointer-events-none"
              tabIndex={-1}
              draggable={false}
            />
            {/* New 배지 - 이미지 위 왼쪽 상단 */}
            {isNewEvent(integration.created_time) && (
              <div className="absolute top-2 left-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm animate-pulse pointer-events-none select-none">
                  New
                </span>
              </div>
            )}
            {/* 돋보기 버튼 */}
            {showZoomButton && (
              <button
                className="absolute top-1 right-1 bg-gray-300 bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded hover:bg-opacity-70"
                onClick={() => setShowModal(true)}
              >
                🔍
              </button>
            )}
          </div>

          {/* 카드 정보 */}
          <div 
            className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 h-10 overflow-hidden"
            title={integration.event_title}
          >
            {integration.event_title}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{integration.period}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            {/* 사이트명 왼쪽 */}
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{integration.site}</span>
            </div>
            {/* 바로가기 링크 오른쪽 */}
            <a
              href={integration.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-800 underline"
            >
              <span>바로가기</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ✅ 확대 이미지 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          contentEditable={false}
        >
          <div className="relative">
            {/* ❌ 닫기 버튼 – 이미지 기준 위치 */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-[-2rem] right-[-2rem] text-white text-3xl font-bold hover:text-gray-300"
              aria-label="닫기"
            >
              ×
            </button>

            {/* 팝업 이미지 */}
            <img
              src={integration.image}
              alt="full-size"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg border border-white select-none pointer-events-none caret-transparent"
              tabIndex={-1}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  )
}
