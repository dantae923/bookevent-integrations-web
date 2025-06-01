import type { Event } from "../../data/integrations"
import { Card, CardContent } from "@/components/ui/card"

type IntegrationCardProps = {
  integration: Event
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group h-full">
      <CardContent className="p-4 flex flex-col h-full space-y-2">
        <img
          src={integration.image}
          alt={integration.book_title}
          className="w-full h-32 object-cover rounded"
        />
        <div className="text-sm font-semibold">{integration.book_title}</div>
        <div className="text-xs text-gray-500">{integration.site}</div>
        <div className="text-xs">{integration.special_goods}</div>
        <div className="text-xs text-gray-400">{integration.period}</div>
        <a
          href={integration.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 underline mt-auto"
        >
          상세 보기 →
        </a>
      </CardContent>
    </Card>
  )
}
