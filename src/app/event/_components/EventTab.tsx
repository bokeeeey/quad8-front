'use client';

import { EVENT_LIST, SECTIONS } from '@/constants/event';
import { useMultipleIntersectionObservers } from '@/hooks/useMultipleIntersectionObservers';
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './EventTab.module.scss';

const cn = classNames.bind(styles);

export default function EventTab() {
  const activeSection = useMultipleIntersectionObservers(SECTIONS, { threshold: 0.5 });

  return (
    <div className={cn('container')}>
      <nav className={cn('inner')}>
        {EVENT_LIST.map((event) => (
          <Link
            key={event.id}
            href={`#${event.id}`}
            className={cn('event-title', { active: activeSection === event.id })}
          >
            {event.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
