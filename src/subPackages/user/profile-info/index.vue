<template>
  <view class="page-shell profile-info-page">
    <view class="info-nav">
      <view class="nav-action" @tap="goBack(ROUTES.TAB_PROFILE)">
        <text class="ri ri-arrow-left-s-line"></text>
      </view>
      <text class="nav-title">编辑个人信息</text>
      <view class="nav-action" @tap="saveProfile">
        <text class="ri ri-check-line"></text>
      </view>
    </view>

    <view class="avatar-card" @tap="changeAvatar">
      <view class="avatar-wrap">
        <image class="avatar" :src="form.avatar" mode="aspectFill" />
        <view class="camera-badge">
          <text class="ri ri-camera-line"></text>
        </view>
      </view>
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <view class="form-section">
      <text class="section-label">基本信息</text>
      <view class="form-card">
        <view class="form-row nickname-row">
          <text class="row-label">昵称</text>
          <input
            v-model="form.nickName"
            class="nickname-input"
            maxlength="16"
            placeholder="请输入昵称"
            placeholder-class="input-placeholder"
          />
          <text class="ri ri-edit-line row-arrow"></text>
        </view>

        <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
          <view class="form-row">
            <text class="row-label">性别</text>
            <view class="row-value">
              <text>{{ form.gender }}</text>
              <text class="ri ri-arrow-down-s-line"></text>
            </view>
          </view>
        </picker>

        <picker mode="date" :value="form.birthday" @change="onBirthdayChange">
          <view class="form-row">
            <text class="row-label">生日</text>
            <view class="row-value">
              <text>{{ form.birthday }}</text>
              <text class="ri ri-calendar-line"></text>
            </view>
          </view>
        </picker>
      </view>
    </view>

    <view class="form-section contact-section">
      <text class="section-label">联系方式</text>
      <view class="form-card">
        <view class="form-row">
          <text class="row-label">手机号</text>
          <view class="row-value phone-value">
            <text>{{ maskedPhone }}</text>
            <text class="verified-tag">已验证</text>
          </view>
        </view>
      </view>
    </view>

    <view class="form-section preference-section">
      <text class="section-label">运动偏好</text>
      <view class="form-card">
        <picker mode="selector" :range="cityOptions" :value="cityIndex" @change="onCityChange">
          <view class="form-row">
            <text class="row-label">常驻城市</text>
            <view class="row-value">
              <text>{{ form.city }}</text>
              <text class="ri ri-map-pin-line"></text>
            </view>
          </view>
        </picker>

        <view class="form-row sports-row">
          <text class="row-label">擅长运动</text>
          <view class="sport-tags">
            <text class="sport-tag green">篮球</text>
            <text class="sport-tag blue">羽毛球</text>
          </view>
        </view>

        <picker mode="selector" :range="levelOptions" :value="levelIndex" @change="onLevelChange">
          <view class="form-row">
            <text class="row-label">运动水平</text>
            <view class="row-value">
              <text>{{ form.sportLevel }}</text>
              <text class="ri ri-arrow-down-s-line"></text>
            </view>
          </view>
        </picker>
      </view>
    </view>

    <view class="save-button" @tap="saveProfile">保存修改</view>

    <bottom-tabbar active="profile" />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import BottomTabbar from '@/components/bottom-tabbar/bottom-tabbar.vue'
import { ROUTES } from '@/config/routes'
import { useUserStore } from '@/stores/user'
import { goBack } from '@/utils/router'

type PickerEvent = {
  detail: {
    value: string | number
  }
}

const user = useUserStore()

const genderOptions = ['男', '女']
const cityOptions = ['北京', '上海', '广州', '深圳', '杭州', '成都']
const levelOptions = ['业余初级', '业余中级', '业余高级']

const form = reactive({
  nickName: user.nickName,
  avatar: user.avatar,
  gender: '男',
  birthday: '1998-06-15',
  phone: '13888888888',
  city: '北京',
  sportLevel: '业余中级'
})

const genderIndex = computed(() => Math.max(0, genderOptions.indexOf(form.gender)))
const cityIndex = computed(() => Math.max(0, cityOptions.indexOf(form.city)))
const levelIndex = computed(() => Math.max(0, levelOptions.indexOf(form.sportLevel)))
const maskedPhone = computed(() => form.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'))

function onGenderChange(event: PickerEvent) {
  form.gender = genderOptions[Number(event.detail.value)] || genderOptions[0]
}

function onBirthdayChange(event: PickerEvent) {
  form.birthday = String(event.detail.value)
}

function onCityChange(event: PickerEvent) {
  form.city = cityOptions[Number(event.detail.value)] || cityOptions[0]
}

function onLevelChange(event: PickerEvent) {
  form.sportLevel = levelOptions[Number(event.detail.value)] || levelOptions[1]
}

function changeAvatar() {
  uni.showActionSheet({
    itemList: ['从微信头像选择', '从相册选择'],
    success: () => {
      uni.showToast({ title: '头像选择功能建设中', icon: 'none' })
    }
  })
}

function saveProfile() {
  const nickName = form.nickName.trim()

  user.setProfile({
    nickName: nickName || user.nickName,
    avatar: form.avatar,
    level: user.level
  })

  uni.showToast({ title: '保存成功', icon: 'success' })
}
</script>

<style scoped lang="scss">
.profile-info-page {
  min-height: 100vh;
  padding-bottom: calc(128rpx + env(safe-area-inset-bottom));
  background: #f4f6f8;
  box-sizing: border-box;
}

.info-nav {
  position: relative;
  display: flex;
  height: 175rpx;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 35rpx 31rpx;
  box-sizing: border-box;
  background: #006440;
}

.nav-action {
  display: flex;
  width: 63rpx;
  height: 63rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 35rpx;
}

.nav-title {
  position: absolute;
  right: 110rpx;
  bottom: 43rpx;
  left: 110rpx;
  color: #ffffff;
  font-size: 35rpx;
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
}

.avatar-card {
  display: flex;
  height: 282rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 35rpx 35rpx 21rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 9rpx 30rpx rgba(15, 23, 42, 0.06);
}

.avatar-wrap {
  position: relative;
  width: 154rpx;
  height: 154rpx;
}

.avatar {
  width: 154rpx;
  height: 154rpx;
  border: 4rpx solid #10b981;
  border-radius: 999rpx;
  box-sizing: border-box;
}

.camera-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  width: 56rpx;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #ffffff;
  border-radius: 999rpx;
  background: #10b981;
  color: #ffffff;
  font-size: 28rpx;
  box-sizing: border-box;
}

.avatar-tip {
  margin-top: 14rpx;
  color: #6b7280;
  font-size: 23rpx;
  font-weight: 500;
}

.form-section {
  margin-top: 21rpx;
  padding: 0 35rpx;
}

.section-label {
  display: block;
  margin: 0 0 14rpx 7rpx;
  color: #9ca3af;
  font-size: 23rpx;
  font-weight: 700;
}

.form-card {
  overflow: hidden;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 9rpx 30rpx rgba(15, 23, 42, 0.06);
}

.form-row {
  position: relative;
  display: flex;
  min-height: 86rpx;
  align-items: center;
  justify-content: space-between;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.form-row + .form-row::before,
picker + picker .form-row::before,
.nickname-row + picker .form-row::before,
picker + .sports-row::before,
.sports-row + picker .form-row::before {
  position: absolute;
  top: 0;
  right: 28rpx;
  left: 137rpx;
  height: 1rpx;
  background: #edf0f4;
  content: '';
}

.row-label {
  flex: 0 0 124rpx;
  color: #1f2937;
  font-size: 26rpx;
  font-weight: 800;
}

.nickname-input {
  flex: 1;
  min-width: 0;
  height: 86rpx;
  color: #1f2937;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 86rpx;
  text-align: right;
}

.input-placeholder {
  color: #b7bec9;
}

.row-value,
.phone-value,
.sport-tags {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  color: #4b5563;
  font-size: 26rpx;
  font-weight: 500;
}

.row-value {
  gap: 12rpx;
}

.row-value .ri,
.row-arrow {
  color: #9ca3af;
  font-size: 28rpx;
}

.row-arrow {
  flex: 0 0 auto;
  margin-left: 12rpx;
}

.phone-value {
  gap: 17rpx;
}

.verified-tag {
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: #d1fae5;
  color: #059669;
  font-size: 21rpx;
  font-weight: 800;
  line-height: 40rpx;
}

.sport-tags {
  gap: 12rpx;
}

.sport-tag {
  height: 40rpx;
  padding: 0 17rpx;
  border-radius: 999rpx;
  font-size: 21rpx;
  font-weight: 800;
  line-height: 40rpx;
}

.sport-tag.green {
  background: #d1fae5;
  color: #059669;
}

.sport-tag.blue {
  background: #dbeafe;
  color: #2563eb;
}

.save-button {
  height: 87rpx;
  margin: 42rpx 35rpx 0;
  border-radius: 28rpx;
  background: #006440;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 87rpx;
  text-align: center;
  box-shadow: 0 9rpx 22rpx rgba(0, 100, 64, 0.18);
}
</style>
