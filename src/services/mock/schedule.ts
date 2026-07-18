import type { VenueDate, VenueSlot } from '@/types/domain'

export const venueDates: VenueDate[] = [
  { label: '', week: '周二', day: '14', value: '2025-01-14' },
  { label: '', week: '周三', day: '15', value: '2025-01-15' },
  { label: '今天', week: '周四', day: '16', value: '2025-01-16' },
  { label: '', week: '周五', day: '17', value: '2025-01-17' },
  { label: '', week: '周六', day: '18', value: '2025-01-18' },
  { label: '', week: '周日', day: '19', value: '2025-01-19' }
]

export const slots: VenueSlot[] = [
  { id: 1, start: '08:00', end: '10:00', price: 80, status: 'available' },
  { id: 2, start: '10:00', end: '12:00', price: 80, status: 'available' },
  { id: 3, start: '12:00', end: '14:00', price: 80, status: 'soldOut' },
  { id: 4, start: '14:00', end: '16:00', price: 80, status: 'selected' },
  { id: 5, start: '16:00', end: '18:00', price: 80, status: 'available' },
  { id: 6, start: '18:00', end: '20:00', price: 100, status: 'available' }
]
