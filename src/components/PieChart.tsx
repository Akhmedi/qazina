'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PieChartData {
  name: string
  value: number
  color: string
  percentage: number
}

interface PieChartProps {
  data: PieChartData[]
  onSegmentSelect?: (segment: PieChartData | null) => void
  selectedSegment?: PieChartData | null
}

export default function PieChart({ data, onSegmentSelect, selectedSegment }: PieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<PieChartData | null>(null)

  const radius = 80
  const centerX = 100
  const centerY = 100
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const createPieSlice = (item: PieChartData, startAngle: number, endAngle: number, index: number) => {
    const isSelected = selectedSegment?.name === item.name
    const isHovered = hoveredSegment?.name === item.name
    const isOtherSelected = selectedSegment && selectedSegment.name !== item.name

    const adjustedRadius = radius + (isSelected || isHovered ? 10 : 0)
    const opacity = isOtherSelected ? 0.3 : 1

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    const x1 = centerX + adjustedRadius * Math.cos(startAngleRad)
    const y1 = centerY + adjustedRadius * Math.sin(startAngleRad)
    const x2 = centerX + adjustedRadius * Math.cos(endAngleRad)
    const y2 = centerY + adjustedRadius * Math.sin(endAngleRad)

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return (
      <motion.path
        key={item.name}
        d={pathData}
        fill={item.color}
        stroke="white"
        strokeWidth="2"
        style={{ opacity }}
        className="cursor-pointer transition-all duration-300"
        onMouseEnter={() => setHoveredSegment(item)}
        onMouseLeave={() => setHoveredSegment(null)}
        onClick={() => onSegmentSelect?.(isSelected ? null : item)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      />
    )
  }

  let currentAngle = 0
  const slices = data.map((item, index) => {
    const angle = (item.value / total) * 360
    const slice = createPieSlice(item, currentAngle, currentAngle + angle, index)
    currentAngle += angle
    return slice
  })

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {slices}
        </motion.svg>

        {/* Center info */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <AnimatePresence mode="wait">
              {selectedSegment || hoveredSegment ? (
                <motion.div
                  key="segment-info"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-lg font-bold text-finovate-navy">
                    {((selectedSegment || hoveredSegment)!.percentage).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {(selectedSegment || hoveredSegment)!.name}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="total-info"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-xl font-bold text-finovate-navy">
                    ${total.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Всего</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
              selectedSegment?.name === item.name 
                ? 'bg-finovate-orange-light' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSegmentSelect?.(selectedSegment?.name === item.name ? null : item)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </div>
              <div className="text-xs text-gray-500">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}