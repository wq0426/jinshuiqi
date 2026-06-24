// 图表通用配色（水蓝科技风）
export const chartColors = ['#3A8EF6', '#26C6DA', '#52c41a', '#faad14', '#ff4d4f', '#9254de', '#13c2c2']

// 生成水蓝渐变（用于折线/面积/柱状）
export function blueGradient(echarts, from = '#3A8EF6', to = 'rgba(58,142,246,0.02)') {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: from },
    { offset: 1, color: to }
  ])
}

// 大屏主题色
export const screenColors = ['#00E5FF', '#26C6DA', '#3A8EF6', '#7C4DFF', '#18FFFF', '#64FFDA']
