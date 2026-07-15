export function money(value: number) {
  return `¥${value.toFixed(2)}`
}

export function yuan(value: number) {
  return `¥${value}`
}

export function go(url: string) {
  uni.navigateTo({ url })
}

export function goTab(url: string) {
  uni.reLaunch({ url })
}
