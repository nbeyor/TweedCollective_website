'use client'

import './chartSetup'
import { Doughnut, Pie as PieJS } from 'react-chartjs-2'
import { chartTheme } from '@/lib/slideTemplates'

const DEFAULT_COLORS = chartTheme.palette

interface Segment {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  segments: Segment[]
  title?: string
  donut?: boolean
  height?: number
}

export default function PieChart({
  segments,
  title,
  donut = true,
  height = 300,
}: PieChartProps) {
  const data = {
    labels: segments.map(s => s.label),
    datasets: [{
      data: segments.map(s => s.value),
      backgroundColor: segments.map((s, i) => s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
      borderColor: 'rgba(10, 10, 12, 0.8)',
      borderWidth: 2,
      ...(donut ? { cutout: '60%' } : {}),
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(245, 244, 240, 0.7)',
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle' as const,
          font: { size: 11 },
        },
      },
      title: title
        ? { display: true, text: title, color: '#F5F4F0', font: { size: 14 } }
        : { display: false },
    },
  }

  const ChartComponent = donut ? Doughnut : PieJS

  return (
    <div style={{ height }}>
      <ChartComponent data={data} options={options} />
    </div>
  )
}
