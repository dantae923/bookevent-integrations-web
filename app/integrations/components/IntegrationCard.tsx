import { useState } from "react"

type Event = {
  image: string
  event_title: string
  site: string
  period: string
  link: string
}

type IntegrationCardProps = {
  integration: Event
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
          <div className="text-sm font-semibold">{integration.event_title}</div>
          <div className="text-xs text-gray-500">사이트: {integration.site}</div>
          <div className="text-xs text-gray-400">기간: {integration.period}</div>
          <a
            href={integration.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 underline mt-auto"
          >
            상품 보러가기 →
          </a>
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
