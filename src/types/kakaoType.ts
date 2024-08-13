export interface Kakao {
  init: (key: string) => void;
  cleanup: () => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: {
      objectType: string;
      content: {
        title: string;
        imageUrl: string;
        link: {
          mobileWebUrl: string;
          webUrl: string;
        };
      };
      commerce: {
        productName: string;
        regularPrice: number;
      };
      buttons: [
        {
          title: string;
          link: {
            mobileWebUrl: string;
            webUrl: string;
          };
        },
      ];
    }) => void;
  };
}
