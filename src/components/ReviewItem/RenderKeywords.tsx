import classNames from 'classnames/bind';
import styles from './ReviewItem.module.scss';

const cn = classNames.bind(styles);

interface RenderKeywordsProps {
  optionKeywords: [string, string[]][];
  optionsValues: number[];
}

export default function RenderKeywords({ optionKeywords, optionsValues }: RenderKeywordsProps) {
  return (
    <div className={cn('keywords')}>
      {optionKeywords.map(([key, values], idx) => (
        <h3 key={key} className={cn('keyword')}>
          <span className={cn('key')}>{key}</span> {values[optionsValues[idx] - 1]}
        </h3>
      ))}
    </div>
  );
}
