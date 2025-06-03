<script setup>
import { computed } from 'vue'
import { useReasonsStore } from '../../stores/reasons'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  review: {
    type: Object,
    required: true
  },
  showDetails: {
    type: Boolean,
    default: false
  }
})

const reasonsStore = useReasonsStore()
const userStore = useUserStore()

const formattedDate = computed(() => {
  if (!props.review.createdAt) return '日付なし'
  
  // Firebase timestamp handling
  const date = props.review.createdAt.toDate ? 
    props.review.createdAt.toDate() : 
    new Date(props.review.createdAt)
    
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
})

const reasonsList = computed(() => {
  return reasonsStore.getReasonsByCode(props.review.reasons)
})

const isLimitedView = computed(() => {
  // Free users can only see limited info
  return !userStore.user || 
         (userStore.subscriptionStatus === 'free' && 
          userStore.freeUsageCount >= 3)
})

const reasonsToShow = computed(() => {
  if (isLimitedView.value && !props.showDetails) {
    return reasonsList.value.slice(0, 1)
  }
  return reasonsList.value
})
</script>

<template>
  <div class="review-card" :class="{ 'limited-view': isLimitedView && !showDetails }">
    <div v-if="isLimitedView && !showDetails" class="premium-overlay">
      <div class="premium-message">
        <p>プレミアム会員になって全ての情報を見る</p>
        <router-link to="/subscription" class="premium-button">プレミアムに登録</router-link>
      </div>
    </div>
    
    <div class="review-header">
      <h3 class="review-title">{{ review.videoTitle }}</h3>
      <span class="review-date">{{ formattedDate }}</span>
    </div>
    
    <div class="review-content">
      <div class="review-id">
        <span class="label">動画ID:</span>
        <span class="value">{{ review.videoId }}</span>
      </div>
      
      <div class="review-reasons">
        <h4>ヌけない理由:</h4>
        <ul class="reasons-list">
          <li v-for="reason in reasonsToShow" :key="reason.code">
            <span class="reason-label">{{ reason.displayName }}</span>
            <span class="reason-category">{{ reason.category }}</span>
          </li>
        </ul>
      </div>
      
      <div v-if="review.imageUrl && (showDetails || userStore.subscriptionStatus === 'premium')" class="review-image">
        <img :src="review.imageUrl" alt="レビュー画像" />
      </div>
      
      <div v-if="!showDetails" class="review-actions">
        <router-link :to="'/review/' + review.id" class="details-button">
          詳細を見る
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-bottom: var(--space-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-duration) ease,
              box-shadow var(--transition-duration) ease;
  position: relative;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.review-header {
  background-color: var(--color-surface-variant);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-title {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.4;
  flex: 1;
}

.review-date {
  font-size: 0.85rem;
  color: var(--color-on-surface-variant);
  margin-left: var(--space-md);
}

.review-content {
  padding: var(--space-lg);
}

.review-id {
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.label {
  font-weight: 500;
  color: var(--color-on-surface-variant);
}

.value {
  font-family: monospace;
  background-color: var(--color-surface-variant);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
}

.review-reasons h4 {
  margin-bottom: var(--space-sm);
  font-size: 1.1rem;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reasons-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-surface-variant);
}

.reasons-list li:last-child {
  border-bottom: none;
}

.reason-label {
  font-weight: 500;
}

.reason-category {
  font-size: 0.85rem;
  color: var(--color-on-surface-variant);
  background-color: var(--color-surface-variant);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
}

.review-image {
  margin-top: var(--space-lg);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.review-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.review-actions {
  margin-top: var(--space-lg);
  display: flex;
  justify-content: center;
}

.details-button {
  display: inline-block;
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  transition: background-color var(--transition-duration) ease;
}

.details-button:hover {
  background-color: var(--color-secondary-hover);
  color: var(--color-on-secondary);
}

.limited-view {
  filter: blur(0px);
  position: relative;
}

.premium-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  backdrop-filter: blur(4px);
  border-radius: var(--border-radius-md);
}

.premium-message {
  text-align: center;
  padding: var(--space-lg);
}

.premium-message p {
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
}

.premium-button {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 500;
  transition: background-color var(--transition-duration) ease;
}

.premium-button:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-on-primary);
}
</style>