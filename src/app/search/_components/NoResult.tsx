import classNames from 'classnames/bind';
import styles from './NoResult.module.scss';

const cn = classNames.bind(styles);

interface NoResultProps {
  keyword: string;
}

export default function NoResult({ keyword }: NoResultProps) {
  return (
    <div className={cn('wrapper')}>
      <div className={cn('title-wrapper')}>
        <span className={cn('keyword')}>&apos;{keyword}&apos; </span>
        <span className={cn('text')}>에 대한 검색 결과가 없습니다</span>
      </div>
      <ul className={cn('content-wrapper')}>
        <li>단어의 철자가 정확한지 확인해보세요.</li>
        <li>한글을 영어로 혹은 영어를 한글로 입력했는지 확인해보세요.</li>
        <li>검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.</li>
        <li>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 보세요.</li>
      </ul>
    </div>
  );
}
