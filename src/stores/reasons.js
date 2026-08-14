import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReasonsStore = defineStore('reasons', () => {
  const reasonCategories = ref([
    {
      id: 'appearance',
      name: '外見・身体的特徴',
      reasons: [
        { code: 'MALE_MASK', displayName: '男優マスクor目出し帽' },
        { code: 'FAT_MALE', displayName: '太っている男優' },
        { code: 'FEMALE_MASK', displayName: '女優マスク' }
      ]
    },
    {
      id: 'performance',
      name: '演技・パフォーマンス',
      reasons: [
        { code: 'VOICE_QUALITY', displayName: '男優・女優の声質' },
        { code: 'OVER_ACTING', displayName: '男優・女優の演技が演技感ありすぎる' },
        { code: 'LONG_OPENING', displayName: 'OPトークが長い・つまらなさすぎる' },
        { code: 'UNNECESSARY_TALK', displayName: '挿入中に不必要な話をしてる' },
        { code: 'PASSIVE_FEMALE', displayName: '女優がマグロ過ぎる' }
      ]
    },
    {
      id: 'technical',
      name: '技術的問題',
      reasons: [
        { code: 'FAKE_CUM', displayName: '偽汁(疑似精子)' },
        { code: 'BAD_QUALITY', displayName: '画質・音声が悪い' },
        { code: 'STUDIO_LIKE', displayName: '撮影場所がスタジオ過ぎる' },
        { code: 'BAD_CAMERA', displayName: 'カメラワークが悪い' }
      ]
    },
    {
      id: 'content',
      name: 'コンテンツ構成',
      reasons: [
        { code: 'SHORT_SEX', displayName: '挿入シーン短すぎ(前戯長すぎ)' },
        { code: 'WRONG_POSITION_ORDER', displayName: 'フィニッシュまでの体位の順番がおかしい' }
      ]
    }
  ])
  
  function getReasonsByCode(codes) {
    if (!codes || !Array.isArray(codes)) return []
    
    const result = []
    reasonCategories.value.forEach(category => {
      category.reasons.forEach(reason => {
        if (codes.includes(reason.code)) {
          result.push({
            ...reason,
            category: category.name
          })
        }
      })
    })
    
    return result
  }
  
  function getAllReasons() {
    const allReasons = []
    reasonCategories.value.forEach(category => {
      category.reasons.forEach(reason => {
        allReasons.push({
          ...reason,
          category: category.name,
          categoryId: category.id
        })
      })
    })
    return allReasons
  }
  
  return {
    reasonCategories,
    getReasonsByCode,
    getAllReasons
  }
})