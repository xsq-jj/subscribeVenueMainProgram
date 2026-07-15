import type {
  CityRegion,
  FavoriteVenue,
  SportCategory,
  SportOrder,
  SportRecord,
  UserCoupon,
  Venue,
  VenueDate,
  VenueReview,
  VenueSlot
} from '@/types/domain'

export const categories: SportCategory[] = [
  { id: 0, name: '全部', icon: '/static/icons/sports/basketball.png', color: '#10B981' },
  { id: 1, name: '篮球', icon: '/static/icons/sports/basketball.png', color: '#FFE89A' },
  { id: 2, name: '羽毛球', icon: '/static/icons/sports/badminton.png', color: '#A8F3CF' },
  { id: 3, name: '网球', icon: '/static/icons/sports/tennis.png', color: '#B9DAFF' },
  { id: 4, name: '足球', icon: '/static/icons/sports/football.png', color: '#D7C1FF' },
  { id: 5, name: '游泳', icon: '/static/icons/sports/swim.png', color: '#A7F2F6' },
  { id: 6, name: '乒乓球', icon: '/static/icons/sports/pingpong.png', color: '#FFD0D8' }
]

const designImages = {
  favoriteBasketball: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077351551285071872.jpg',
  favoriteBadminton: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077351585593810944.jpg',
  favoriteFootball: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077351678879993856.jpg',
  favoriteGym: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077351704150675456.jpg',
  orderBasketball: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077268983730003968.jpg',
  orderBadminton: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077269021868810240.jpg',
  orderTennis: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077269054869594112.jpg',
  reviewAvatar1: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352250604904448.jpg',
  reviewImage1: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352282796187648.jpg',
  reviewImage2: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352282926878720.jpg',
  reviewImage3: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352282616500224.jpg',
  reviewAvatar3: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352316929433601.jpg',
  reviewImage4: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352316929433600.jpg',
  reviewImage5: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352316938489856.jpg',
  reviewAvatar4: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352350958489600.jpg',
  reviewAvatar5: 'https://prototype-prod-1254106194.cos.ap-beijing.myqcloud.com/calicat/file/ai/canvas/image/2077352381291696128.jpg'
}

export const venues: Venue[] = [
  {
    id: 1,
    name: '奥体中心篮球馆',
    cover: '/static/images/venue-basketball.png',
    score: 4.8,
    district: '朝阳区',
    address: '奥体中心',
    distance: '2.3km',
    tags: ['室内', '空调', '免费停车'],
    tagTypes: ['green', 'blue', 'orange'],
    todayAvailableText: '今日可约 18:00-22:00',
    minPrice: 80,
    monthlySales: '1200+'
  },
  {
    id: 2,
    name: '朝阳羽毛球馆',
    cover: '/static/images/venue-badminton.png',
    score: 4.6,
    district: '朝阳区',
    address: '大望路',
    distance: '1.8km',
    tags: ['室内', '淋浴'],
    tagTypes: ['green', 'purple'],
    todayAvailableText: '今日可约 08:00-21:00',
    minPrice: 60,
    monthlySales: '830+'
  },
  {
    id: 3,
    name: '海淀网球中心',
    cover: '/static/images/venue-tennis.png',
    score: 4.7,
    district: '海淀区',
    address: '中关村',
    distance: '3.5km',
    tags: ['室外', '灯光'],
    tagTypes: ['orange', 'blue'],
    todayAvailableText: '今日可约 06:00-20:00',
    minPrice: 100,
    monthlySales: '960+'
  }
]

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

export const orders: SportOrder[] = [
  {
    id: 1,
    orderNo: 'YD20250116001',
    status: 'WAIT_USE',
    venueName: '奥体中心篮球馆',
    venueCover: designImages.orderBasketball,
    dateText: '2025年1月16日 周四',
    timeText: '14:00-16:00',
    courtName: '3号场地',
    amount: 140
  },
  {
    id: 2,
    orderNo: 'YD20250110003',
    status: 'COMPLETED',
    venueName: '朝阳羽毛球馆',
    venueCover: designImages.orderBadminton,
    dateText: '2025年1月10日 周五',
    timeText: '10:00-12:00',
    courtName: '2号场地',
    amount: 120
  },
  {
    id: 3,
    orderNo: 'YD20250108005',
    status: 'CANCELLED',
    venueName: '海淀网球中心',
    venueCover: designImages.orderTennis,
    dateText: '2025年1月8日 周三',
    timeText: '16:00-18:00',
    courtName: '1号场地',
    amount: 200
  }
]

export function findVenue(id = 1) {
  return venues.find(item => item.id === id) || venues[0]
}

export const coupons: UserCoupon[] = [
  {
    id: 1,
    title: '新用户立减券',
    description: '全场运动场馆通用',
    valueText: '¥20',
    thresholdText: '满100可用',
    expireText: '有效期至 2025-02-16',
    status: 'AVAILABLE',
    theme: 'green'
  },
  {
    id: 2,
    title: '周末运动满减券',
    description: '限周末及节假日使用',
    valueText: '¥30',
    thresholdText: '满200可用',
    expireText: '有效期至 2025-03-31',
    status: 'AVAILABLE',
    theme: 'purple'
  },
  {
    id: 3,
    title: '黄金会员专享折扣',
    description: '限篮球/羽毛球场馆，最高减50元',
    valueText: '8.5折',
    thresholdText: '不限门槛',
    expireText: '有效期至 2025-06-30',
    status: 'AVAILABLE',
    theme: 'orange'
  },
  {
    id: 4,
    title: '工作日早场券',
    description: '仅限工作日 12:00 前使用',
    valueText: '¥15',
    thresholdText: '满80可用',
    expireText: '已使用',
    status: 'USED',
    theme: 'green'
  },
  {
    id: 5,
    title: '老客回归券',
    description: '限指定场馆使用',
    valueText: '¥25',
    thresholdText: '满150可用',
    expireText: '已过期',
    status: 'EXPIRED',
    theme: 'purple'
  }
]

export const favoriteVenues: FavoriteVenue[] = [
  { ...venues[0], cover: designImages.favoriteBasketball, categoryId: 1, reviewCount: 286 },
  { ...venues[1], cover: designImages.favoriteBadminton, categoryId: 2, reviewCount: 158 },
  { ...venues[2], cover: designImages.favoriteGym, categoryId: 3, reviewCount: 203 },
  {
    ...venues[0],
    id: 4,
    name: '东城游泳馆',
    cover: designImages.favoriteGym,
    score: 4.5,
    district: '东城区',
    address: '东直门',
    distance: '4.2km',
    tags: ['恒温', '停车'],
    tagTypes: ['blue', 'orange'],
    todayAvailableText: '今日可约 09:00-21:00',
    minPrice: 45,
    monthlySales: '620+',
    categoryId: 5,
    reviewCount: 96
  },
  {
    ...venues[2],
    id: 5,
    name: '丰台足球场',
    cover: designImages.favoriteFootball,
    score: 4.3,
    district: '丰台区',
    address: '科技园',
    distance: '5.8km',
    tags: ['室外', '灯光'],
    tagTypes: ['orange', 'blue'],
    todayAvailableText: '今日可约 18:00-22:00',
    minPrice: 200,
    monthlySales: '420+',
    categoryId: 4,
    reviewCount: 72
  },
  {
    ...venues[0],
    id: 6,
    name: '西城综合体育馆',
    cover: designImages.favoriteGym,
    score: 4.4,
    district: '西城区',
    address: '金融街',
    distance: '3.1km',
    tags: ['室内', '空调'],
    tagTypes: ['green', 'blue'],
    todayAvailableText: '今日可约 10:00-20:00',
    minPrice: 90,
    monthlySales: '510+',
    categoryId: 0,
    reviewCount: 134
  },
  {
    ...venues[0],
    id: 7,
    name: '通州篮球公园',
    cover: designImages.favoriteBasketball,
    score: 4.6,
    district: '通州区',
    address: '运河商务区',
    distance: '6.2km',
    tags: ['室内', '停车'],
    tagTypes: ['green', 'orange'],
    todayAvailableText: '今日可约 12:00-22:00',
    minPrice: 70,
    monthlySales: '760+',
    categoryId: 1,
    reviewCount: 118
  },
  {
    ...venues[1],
    id: 8,
    name: '海淀羽毛球中心',
    cover: designImages.favoriteBadminton,
    score: 4.5,
    district: '海淀区',
    address: '五道口',
    distance: '4.8km',
    tags: ['室内', '淋浴'],
    tagTypes: ['green', 'purple'],
    todayAvailableText: '今日可约 09:00-21:00',
    minPrice: 55,
    monthlySales: '690+',
    categoryId: 2,
    reviewCount: 102
  },
  {
    ...venues[2],
    id: 9,
    name: '望京网球俱乐部',
    cover: designImages.favoriteGym,
    score: 4.7,
    district: '朝阳区',
    address: '望京',
    distance: '3.9km',
    tags: ['室外', '灯光'],
    tagTypes: ['orange', 'blue'],
    todayAvailableText: '今日可约 16:00-22:00',
    minPrice: 120,
    monthlySales: '540+',
    categoryId: 3,
    reviewCount: 147
  },
  {
    ...venues[2],
    id: 10,
    name: '朝阳足球训练场',
    cover: designImages.favoriteFootball,
    score: 4.4,
    district: '朝阳区',
    address: '东坝',
    distance: '7.1km',
    tags: ['室外', '灯光'],
    tagTypes: ['orange', 'blue'],
    todayAvailableText: '今日可约 18:00-22:00',
    minPrice: 180,
    monthlySales: '380+',
    categoryId: 4,
    reviewCount: 86
  },
  {
    ...venues[0],
    id: 11,
    name: '国贸健身游泳馆',
    cover: designImages.favoriteGym,
    score: 4.6,
    district: '朝阳区',
    address: '国贸',
    distance: '2.8km',
    tags: ['恒温', '停车'],
    tagTypes: ['blue', 'orange'],
    todayAvailableText: '今日可约 07:00-22:00',
    minPrice: 50,
    monthlySales: '820+',
    categoryId: 5,
    reviewCount: 156
  },
  {
    ...venues[0],
    id: 12,
    name: '金融街综合运动馆',
    cover: designImages.favoriteGym,
    score: 4.5,
    district: '西城区',
    address: '金融街',
    distance: '3.4km',
    tags: ['室内', '空调'],
    tagTypes: ['green', 'blue'],
    todayAvailableText: '今日可约 10:00-20:00',
    minPrice: 88,
    monthlySales: '470+',
    categoryId: 0,
    reviewCount: 121
  }
]

export const sportRecords: SportRecord[] = [
  { id: 1, venueId: 1, venueName: '奥体中心篮球馆', sportType: '篮球', dateText: '1月16日', timeText: '14:00-16:00', durationHour: 2, amount: 140, status: 'COMPLETED' },
  { id: 2, venueId: 2, venueName: '朝阳羽毛球馆', sportType: '羽毛球', dateText: '1月10日', timeText: '10:00-12:00', durationHour: 2, amount: 120, status: 'COMPLETED' },
  { id: 3, venueId: 3, venueName: '海淀网球中心', sportType: '网球', dateText: '1月8日', timeText: '16:00-18:00', durationHour: 2, amount: 200, status: 'CANCELLED' },
  { id: 4, venueId: 1, venueName: '奥体中心篮球馆', sportType: '篮球', dateText: '1月3日', timeText: '18:00-20:00', durationHour: 2, amount: 160, status: 'COMPLETED' },
  { id: 5, venueId: 2, venueName: '朝阳羽毛球馆', sportType: '羽毛球', dateText: '12月28日', timeText: '08:00-10:00', durationHour: 2, amount: 120, status: 'COMPLETED' },
  { id: 6, venueId: 4, venueName: '东城游泳馆', sportType: '游泳', dateText: '12月21日', timeText: '19:00-20:00', durationHour: 1, amount: 45, status: 'COMPLETED' }
]

export const cityRegions: CityRegion[] = [
  { id: 1, city: '北京', name: '朝阳区', count: 12 },
  { id: 2, city: '北京', name: '海淀区', count: 8 },
  { id: 3, city: '北京', name: '东城区', count: 5 },
  { id: 4, city: '北京', name: '西城区', count: 4 },
  { id: 5, city: '北京', name: '丰台区', count: 6 },
  { id: 6, city: '北京', name: '通州区', count: 3 },
  { id: 7, city: '上海', name: '浦东新区', count: 9 },
  { id: 8, city: '广州', name: '天河区', count: 7 },
  { id: 9, city: '深圳', name: '南山区', count: 6 },
  { id: 10, city: '杭州', name: '西湖区', count: 5 },
  { id: 11, city: '成都', name: '锦江区', count: 6 },
  { id: 12, city: '南京', name: '玄武区', count: 4 },
  { id: 13, city: '武汉', name: '武昌区', count: 5 }
]

export const hotSearchWords = [
  '奥体中心篮球馆',
  '周末篮球场',
  '朝阳羽毛球馆',
  '室内篮球馆',
  '海淀网球中心',
  '免费停车球场',
  '游泳馆',
  '足球场'
]

export const reviews: VenueReview[] = [
  {
    id: 1,
    userName: '篮球爱好者小王',
    avatar: designImages.reviewAvatar1,
    rating: 5,
    timeText: '3天前',
    content: '场地非常棒！地板很新，灯光也很舒服。周末和朋友来打球体验很好，停车也方便。下次还会再来！',
    images: [designImages.reviewImage1, designImages.reviewImage2, designImages.reviewImage3],
    likeCount: 128,
    commentCount: 12
  },
  {
    id: 2,
    userName: '运动达人Lily',
    avatar: designImages.reviewAvatar3,
    rating: 4,
    timeText: '1周前',
    content: '整体不错，就是周末人比较多需要提前预约。建议工作日来，场地更空一些。',
    images: [],
    likeCount: 56,
    commentCount: 3
  },
  {
    id: 3,
    userName: '篮球老炮儿',
    avatar: designImages.reviewAvatar3,
    rating: 5,
    timeText: '2周前',
    content: '奥体中心篮球馆是我在北京打过最好的室内场，枫木地板脚感一流，空调也给力。就是价格稍微贵了点，但物有所值！',
    images: [designImages.reviewImage4, designImages.reviewImage5],
    likeCount: 203,
    commentCount: 28
  },
  {
    id: 4,
    userName: '小陈爱运动',
    avatar: designImages.reviewAvatar4,
    rating: 3,
    timeText: '3周前',
    content: '场地还行，但更衣室有点小，高峰期洗澡要排队。希望可以改善一下配套设施。',
    images: [],
    likeCount: 34,
    commentCount: 8,
    merchantReply: '感谢您的反馈！我们正在扩建更衣室，预计下月完工，届时将提供更舒适的体验。'
  },
  {
    id: 5,
    userName: '大刘不打球',
    avatar: designImages.reviewAvatar5,
    rating: 5,
    timeText: '1月前',
    content: '预约方便，到场直接扫码入场。场地维护得很好，每周都来打两次。推荐给所有篮球爱好者！',
    images: [],
    likeCount: 89,
    commentCount: 5
  }
]
