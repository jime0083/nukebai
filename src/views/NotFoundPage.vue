<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <p>ページが見つかりませんでした。</p>
      <router-link :to="{ name: 'home' }" class="btn btn-primary">
        ホームに戻る
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.not-found-content {
  text-align: center;
  
  h1 {
    font-size: 6rem;
    font-weight: 700;
    color: #7E57C2;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #666;
  }
}
</style>