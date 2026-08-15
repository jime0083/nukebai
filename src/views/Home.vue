<template>
  <div class="home-page">
    <HeroSection :catchphrase="heroTopCatchphrase" variant="top" />

    <div class="container">
      <AboutSection />

      <HowToUseSection title="ヌケバイの使い方" :cards="usageCards" />
    </div>

    <HeroSection :catchphrase="heroTop2Catchphrase" variant="top2" />

    <div class="container">
      <HowToUseSection title="ヌけなかった動画を報告してポイント獲得！" :cards="reportCards" />
    </div>

    <BottomCta />
  </div>
</template>

<script setup>
import HeroSection from '../components/home/HeroSection.vue';
import AboutSection from '../components/home/AboutSection.vue';
import HowToUseSection from '../components/home/HowToUseSection.vue';
import BottomCta from '../components/home/BottomCta.vue';

import howToImage1 from '../assets/images/use1.png';
import howToImage2 from '../assets/images/use2.png';
import howToImage3 from '../assets/images/use3.jpg';
import reportImage1 from '../assets/images/use4.png';
import reportImage2 from '../assets/images/use5.png';
import reportImage3 from '../assets/images/use6.png';

const heroTopCatchphrase =
  'あなたは今まで<br><span class="highlight-red">ヌけないアダルト動画</span>に<br>どれだけの<span class="highlight-red">時間</span>と<span class="highlight-red">お金</span>を費やしましたか?';
const heroTop2Catchphrase =
  'ヌけないアダルト動画を見たら<br><span class="highlight-red">ポイントに変換！</span>';

const usageCards = [
  {
    img: howToImage1,
    alt: '使い方1：動画を検索',
    heading: 'ステップ1：動画を検索',
    body: [
      {
        html: 'アダルト動画を見る前に気になる動画を検索しましょう<br>ログインすれば無料で検索できます！',
      },
    ],
  },
  {
    img: howToImage2,
    alt: '使い方2：レビューを投稿',
    heading: 'ステップ2：レビューを投稿',
    body: [
      { html: '検索ページの検索ボックスに動画IDを入力してください' },
      { html: '※検索・報告のご利用にはログインが必要です', cls: 'disclaimer-text text-left' },
    ],
  },
  {
    img: howToImage3,
    alt: '使い方3：賢く視聴',
    heading: 'ステップ3：賢く視聴',
    body: [
      {
        html: 'これまでその動画で「ヌけなかった」人の情報を基に本当に楽しめる作品だけを選んで視聴。貴重な時間とお金の浪費を防ぎます。',
      },
    ],
  },
];

const reportCards = [
  {
    img: reportImage1,
    alt: '使い方1：動画を検索',
    heading: 'ステップ1：ヌけない動画を見たら...',
    body: [
      {
        html: 'ヌけない動画を見たら、右上の「報告」をクリックしヌけない動画の情報をポイントに変換しましょう',
      },
    ],
  },
  {
    img: reportImage2,
    alt: '使い方2：レビューを投稿',
    heading: 'ステップ2：ヌけない動画を報告',
    body: [{ html: 'ヌけなかった動画のIDと共になぜヌけなかったのか理由を選択して「報告」ボタンをクリック！' }],
  },
  {
    img: reportImage3,
    alt: '使い方3：賢く視聴',
    heading: 'ステップ3：ポイント獲得',
    body: [
      {
        html: '報告後すぐにポイントが付与されます。貯まったポイントは今後追加予定の機能で利用できるようになります',
      },
      { html: '※ポイント利用機能は近日実装予定' },
    ],
  },
];
</script>

<style scoped>
@media (max-width: 1024px) {
  .home-page {
    overflow-x: hidden;
  }
}

@media (max-width: 640px) {
  .home-page {
    overflow-x: hidden;
  }
}
</style>
