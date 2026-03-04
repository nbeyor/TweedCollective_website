'use client'

import './chartSetup'
import { Bar } from 'react-chartjs-2'
import { chartTheme } from '@/lib/slideTemplates'

interface BarItem {
  label: string
  value: number
  color?: string
}

interface HorizontalBarChartProps {
  items: BarItem[]
  title?: string
  suffix?: string
  maxValue?: number
  height?: number
  color?: string
}

export default function HorizontalBarChart({
  items,
  title,
  suffix = '',
  maxValue,
  height,
  color = chartTheme.primary,
}: HorizontalBarChartProps) {
  const computedHeight = height || Math.max(200, items.length * 40 + 60)

  const data = {
    labels: items.map(i => i.label),
    datasets: [{
      data: items.map(i => i.value),
      backgroundColor: items.map(i => i.color || `${color}cc`),
      borderColor: color,
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.7,
    }],
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: title
        ? { display: true, text: title, color: '#F5F4F0', font: { size: 14 } }
        : { display: false },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => `${ctx.parsed?.x ?? 0}${suffix}`,
        },
      },
    },
    scales: {
      x: {
        max: maxValue,
        ticks: {
          color: 'rgba(245, 244, 240, 0.5)',
          font: { size: 10 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (v: any) => `${v}${suffix}`,
        },
        grid: { color: 'rgba(245, 244, 240, 0.05)' },
        border: { display: false },
      },
      y: {
        ticks: { color: 'rgba(245, 244, 240, 0.7)', font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
  }

  return (
    <div style={{ height: computedHeight }}>
      <Bar data={data} options={options} />
    </div>
  )
}
