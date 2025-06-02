<template>
  <div class="review-card">
    <div class="review-header">
      <h3 class="review-title">{{ review.videoTitle }}</h3>
      <span class="review-id">ID: {{ review.videoId }}</span>
    </div>
    
    <div class="review-reasons">
      <h4>ヌけない理由:</h4>
      <ul class="reason-tags">
        <li v-for="reasonCode in review.reasons" :key="reasonCode" class="reason-tag">
          {{ getReasonName(reasonCode) }}
        </li>
      </ul>
    </div>
    
    <div v-if="showImage && review.imageUrl" class="review-image">
      <img :src="review.imageUrl" alt="Review thumbnail" />
    </div>
    
    <div class="review-footer">
      <span class="review-date">{{ formatDate(review.createdAt) }}</span>
      <router-link :to="{ name: 'review-detail', params: { id: review.id } }" class="view-details">
        詳細を見る
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  review: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const authStore = useAuthStore()

// Show image only for premium users
const showImage = computed(() => {
  return authStore.isPremium && props.review.imageUrl
})

// Get reason name from reason code
function getReasonName(reasonCode) {
  const category = props.categories.find(cat => cat.code === reasonCode)
  return category ? category.displayName : reasonCode
}

// Format date
function formatDate(date) {
  if (!date) return ''
  
  // Convert Firestore timestamp to Date if needed
  const dateObj = typeof date === 'object' && date.toDate ? date.toDate() : date
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(dateObj)
}
</script>

<style lang="scss" scoped>
.review-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.review-header {
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
}

.review-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-id {
  font-size: 0.875rem;
  color: #666;
  display: block;
}

.review-reasons {
  padding: 1.25rem;
  flex-grow: 1;
  
  h4 {
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
}

.reason-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.reason-tag {
  background-color: #f3e5f5;
  color: #7E57C2;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.review-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.review-date {
  font-size: 0.875rem;
  color: #666;
}

.view-details {
  color: #7E57C2;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}
</style>