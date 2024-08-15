import type { OptionRatio } from '@/types/ProductReviewType';

export const getMaxKey = (options: OptionRatio) => {
  return Object.keys(options).reduce((maxKey, key) => {
    return options[key] > options[maxKey] ? key : maxKey;
  });
};
