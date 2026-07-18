import type { SportCategory } from '@/types/domain'

export const categories: SportCategory[] = [
  { id: 0, name: '全部', icon: '/static/icons/sports/basketball.png', color: '#10B981' },
  { id: 1, name: '篮球', icon: '/static/icons/sports/basketball.png', color: '#FFE89A' },
  { id: 2, name: '羽毛球', icon: '/static/icons/sports/badminton.png', color: '#A8F3CF' },
  { id: 3, name: '网球', icon: '/static/icons/sports/tennis.png', color: '#B9DAFF' },
  { id: 4, name: '足球', icon: '/static/icons/sports/football.png', color: '#D7C1FF' },
  { id: 5, name: '游泳', icon: '/static/icons/sports/swim.png', color: '#A7F2F6' },
  { id: 6, name: '乒乓球', icon: '/static/icons/sports/pingpong.png', color: '#FFD0D8' }
]
