import { Card, CardContent } from "@/components/ui/card"

interface MetricsCardProps {
  title: string
  value: string
  change?: string
  isPositive?: boolean
}

export function MetricsCard({ title, value, change, isPositive }: MetricsCardProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="pt-6">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-bold mt-2">{value}</div>
        {change && (
          <div className={`text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

