'use client';

import { Kakao } from '@/types/kakaoType';
import { ProductType } from '@/types/productType';
import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: Kakao;
  }
}

const useKakaoShare = (shareUrl: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY!);
      }
    }
  }, []);

  const shareKakao = (data: ProductType) => {
    const kakao = window.Kakao;

    kakao.Share.sendDefault({
      objectType: 'commerce',
      content: {
        title: '나만의 커스텀 키보드를 만들고 싶다면? 키보드 득템 KEYDEUK ⌨',
        imageUrl: data.thubmnailList[0].imgUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      commerce: {
        productName: data.name,
        regularPrice: data.price,
      },
      buttons: [
        {
          title: '키득 바로가기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };
  return { shareKakao };
};

export default useKakaoShare;
