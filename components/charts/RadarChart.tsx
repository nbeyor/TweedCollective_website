'use client'

import './chartSetup'
import { Radar } from 'react-chartjs-2'
import { chartTheme } from '@/lib/slideTemplates'

interface RadarChartProps {
  labels: string[]
  values: number[]
  maxValue?: number
  title?: string
  color?: string
  height?: number
}

export default function RadarChart({
  labels,
  values,
  maxValue = 10,
  title,
  color = chartTheme.primary,
  height = 300,
}: RadarChartProps) {
  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: `${color}33`,
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: '#F5F4F0',
      pointBorderWidth: 1,
      pointRadius: 4,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: title
        ? { display: true, text: title, color: '#F5F4F0', font: { size: 14 } }
        : { display: false },
    },
    scales: {
      r: {
        max: maxValue,
        min: 0,
        ticks: {
          stepSize: maxValue / 5,
          color: 'rgba(245, 244, 240, 0.4)',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        pointLabels: {
          color: 'rgba(245, 244, 240, 0.8)',
          font: { size: 11 },
        },
        grid: { color: 'rgba(245, 244, 240, 0.1)' },
        angleLines: { color: 'rgba(245, 244, 240, 0.1)' },
      },
    },
  }

  return (
    <div style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  )
}
