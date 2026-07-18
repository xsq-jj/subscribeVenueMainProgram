import { goTab as openTab, navigateTo } from '@/utils/router'

export function money(value: number) {
  return `¥${value.toFixed(2)}`
}

export function yuan(value: number) {
  return `¥${value}`
}

export function go(url: string) {
  navigateTo(url)
}

export function goTab(url: string) {
  openTab(url)
}
