'use client';

import { Kakao } from '@/types/KakaoType';
import { ProductType } from '@/types/ProductTypes';
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
        title: '커스텀 키보드를 쉽게 구매하고 싶다면? 키득으로 오세요!',
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
