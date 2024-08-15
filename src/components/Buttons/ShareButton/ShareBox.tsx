import useKakaoShare from '@/hooks/useKakaoShare';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { KakaoIcon, LinkCopyIcon } from '@/public/index';
import type { ProductType } from '@/types/ProductType';
import classNames from 'classnames/bind';
import { MouseEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import styles from './ShareButton.module.scss';

const cn = classNames.bind(styles);

interface ShareBoxProps {
  onClickClose: () => void;
  data: ProductType;
}

export default function ShareBox({ onClickClose, data }: ShareBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  const shareUrl = window.location.href;

  useOutsideClick(boxRef, () => {
    onClickClose();
  });

  const { shareKakao } = useKakaoShare(shareUrl);

  const handleKakaoIconClick = (e: MouseEvent) => {
    e.stopPropagation();
    shareKakao(data);
  };

  const handleLinkIconClick = async (e: MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      toast.error('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className={cn('share-box')} ref={boxRef}>
      <h2 className={cn('share-title')}>공유하기</h2>
      <div className={cn('share-contents')}>
        <div className={cn('share-content')}>
          <KakaoIcon className={cn('share-icon')} onClick={handleKakaoIconClick} />
          <h2 className={cn('share-text')}>카카오톡</h2>
        </div>
        <div className={cn('share-content')}>
          <LinkCopyIcon className={cn('share-icon')} onClick={handleLinkIconClick} />
          <h2 className={cn('share-text')}>링크복사</h2>
        </div>
      </div>
    </div>
  );
}
