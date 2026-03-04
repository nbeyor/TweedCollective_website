'use client'

import './chartSetup'
import { Scatter } from 'react-chartjs-2'
import { chartTheme } from '@/lib/slideTemplates'

interface QuadrantPoint {
  label: string
  x: number
  y: number
}

interface QuadrantChartProps {
  title?: string
  xLabel: string
  yLabel: string
  /** [topRight, topLeft, bottomLeft, bottomRight] */
  quadrants: [string, string, string, string]
  points: QuadrantPoint[]
  height?: number
}

export default function QuadrantChart({
  title,
  xLabel,
  yLabel,
  quadrants,
  points,
  height = 350,
}: QuadrantChartProps) {
  const data = {
    datasets: [{
      data: points.map(p => ({ x: p.x, y: p.y })),
      backgroundColor: chartTheme.primary,
      borderColor: '#F5F4F0',
      borderWidth: 1,
      pointRadius: 8,
      pointHoverRadius: 10,
    }],
  }

  const pointAnnotations = Object.fromEntries(
    points.map((p, i) => [
      `pointLabel${i}`,
      {
        type: 'label' as const,
        xValue: p.x,
        yValue: p.y - 0.07,
        content: p.label,
        color: 'rgba(245, 244, 240, 0.8)',
        font: { size: 10 },
      },
    ])
  )

  const options = {
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
          label: (ctx: any) => points[ctx.dataIndex]?.label || '',
        },
      },
      annotation: {
        annotations: {
          vLine: {
            type: 'line' as const,
            xMin: 0.5,
            xMax: 0.5,
            borderColor: 'rgba(245, 244, 240, 0.2)',
            borderWidth: 1,
            borderDash: [4, 4],
          },
          hLine: {
            type: 'line' as const,
            yMin: 0.5,
            yMax: 0.5,
            borderColor: 'rgba(245, 244, 240, 0.2)',
            borderWidth: 1,
            borderDash: [4, 4],
          },
          q1Label: {
            type: 'label' as const,
            xValue: 0.75,
            yValue: 0.9,
            content: quadrants[0],
            color: 'rgba(245, 244, 240, 0.25)',
            font: { size: 13, weight: 'bold' as const },
          },
          q2Label: {
            type: 'label' as const,
            xValue: 0.25,
            yValue: 0.9,
            content: quadrants[1],
            color: 'rgba(245, 244, 240, 0.25)',
            font: { size: 13, weight: 'bold' as const },
          },
          q3Label: {
            type: 'label' as const,
            xValue: 0.25,
            yValue: 0.1,
            content: quadrants[2],
            color: 'rgba(245, 244, 240, 0.25)',
            font: { size: 13, weight: 'bold' as const },
          },
          q4Label: {
            type: 'label' as const,
            xValue: 0.75,
            yValue: 0.1,
            content: quadrants[3],
            color: 'rgba(245, 244, 240, 0.25)',
            font: { size: 13, weight: 'bold' as const },
          },
          ...pointAnnotations,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: xLabel,
          color: 'rgba(245, 244, 240, 0.6)',
          font: { size: 11 },
        },
        ticks: { display: false },
        grid: { display: false },
        border: { color: 'rgba(245, 244, 240, 0.1)' },
      },
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: yLabel,
          color: 'rgba(245, 244, 240, 0.6)',
          font: { size: 11 },
        },
        ticks: { display: false },
        grid: { display: false },
        border: { color: 'rgba(245, 244, 240, 0.1)' },
      },
    },
  }

  return (
    <div style={{ height }}>
      <Scatter data={data} options={options} />
    </div>
  )
}
