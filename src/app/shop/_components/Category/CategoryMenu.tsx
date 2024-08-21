import { ROUTER } from '@/constants/route';
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './CategoryMenu.module.scss';

const cn = classNames.bind(styles);

const categoryItems = [
  { href: ROUTER.SHOP.ALL, label: '전체' },
  { href: ROUTER.SHOP.KEYBOARD, label: '키보드' },
  { href: ROUTER.SHOP.KEYCAP, label: '키캡' },
  { href: ROUTER.SHOP.SWITCH, label: '스위치' },
  { href: ROUTER.SHOP.ETC, label: '기타 용품' },
];
interface CategoryMenuItemProp {
  href: string;
  label: string;
}
function CategoryMenuItem({ href, label }: CategoryMenuItemProp) {
  return (
    <Link className={cn('menu-item')} href={href}>
      <li className={cn('item')}>{label}</li>
    </Link>
  );
}

export default function CategoryMenu() {
  return (
    <nav>
      <ul className={cn('category-list')}>
        {categoryItems.map(({ href, label }) => (
          <CategoryMenuItem key={href} href={href} label={label} />
        ))}
      </ul>
    </nav>
  );
}
