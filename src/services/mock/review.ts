import type { VenueReview } from '@/types/domain'
import { designImages } from './assets'

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
    content: '整体不错，就是周末人比较多，需要提前预约。建议工作日来，场地会更空一些。',
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
    content: '奥体中心篮球馆是我在北京打过最好的室内场，木地板脚感一流，空调也给力。就是价格稍微贵一点，但物有所值！',
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
    content: '场地还行，但更衣室有点小，高峰期淋浴要排队。希望可以改善一下配套设施。',
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
    timeText: '1个月前',
    content: '预约方便，到场直接扫码入场。场地维护得很好，每周都来打两次。推荐给所有篮球爱好者！',
    images: [],
    likeCount: 89,
    commentCount: 5
  }
]
