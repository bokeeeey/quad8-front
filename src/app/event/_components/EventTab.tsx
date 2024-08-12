'use client';

import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './EventTab.module.scss';

const cn = classNames.bind(styles);

export default function EventTab() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = ['join', 'roulette', 'delivery'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const eventList = [
    { id: 'join', title: '신규 가입 혜택' },
    { id: 'roulette', title: '100% 당첨 룰렛' },
    { id: 'delivery', title: '언제나 무료배송' },
  ];

  return (
    <div className={cn('container')}>
      <nav className={cn('inner')}>
        {eventList.map((event) => (
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
