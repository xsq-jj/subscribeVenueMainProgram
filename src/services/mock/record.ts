import type { SportRecord } from '@/types/domain'

export const sportRecords: SportRecord[] = [
  { id: 1, venueId: 1, venueName: '奥体中心篮球馆', sportType: '篮球', dateText: '1月16日', timeText: '14:00-16:00', durationHour: 2, amount: 140, status: 'COMPLETED' },
  { id: 2, venueId: 2, venueName: '朝阳羽毛球馆', sportType: '羽毛球', dateText: '1月10日', timeText: '10:00-12:00', durationHour: 2, amount: 120, status: 'COMPLETED' },
  { id: 3, venueId: 3, venueName: '海淀网球中心', sportType: '网球', dateText: '1月8日', timeText: '16:00-18:00', durationHour: 2, amount: 200, status: 'CANCELLED' },
  { id: 4, venueId: 1, venueName: '奥体中心篮球馆', sportType: '篮球', dateText: '1月3日', timeText: '18:00-20:00', durationHour: 2, amount: 160, status: 'COMPLETED' },
  { id: 5, venueId: 2, venueName: '朝阳羽毛球馆', sportType: '羽毛球', dateText: '12月28日', timeText: '08:00-10:00', durationHour: 2, amount: 120, status: 'COMPLETED' },
  { id: 6, venueId: 4, venueName: '东城游泳馆', sportType: '游泳', dateText: '12月21日', timeText: '19:00-20:00', durationHour: 1, amount: 45, status: 'COMPLETED' }
]
