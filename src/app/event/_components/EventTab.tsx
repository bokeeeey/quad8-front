import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './EventTab.module.scss';

const cn = classNames.bind(styles);

export default function EventTab() {
  const eventList = [
    { id: '#join', title: '신규 가입 혜택' },
    { id: '#roulette', title: '100% 당첨 룰렛' },
    { id: '#delivery', title: '언제나 무료배송' },
  ];

  return (
    <div className={cn('container')}>
      <nav className={cn('inner')}>
        {eventList.map((event) => {
          return (
            <Link key={event.id} href={event.id} className={cn('event-title')}>
              {event.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
