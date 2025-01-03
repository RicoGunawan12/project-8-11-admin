import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Transaction',
    path: '/transactions',
    icon: icon('ic-cart'),
  },
  {
    title: 'Category',
    path: '/categories',
    icon: icon('ic-cart'),
  },
  {
    title: 'Product',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Promo',
    path: '/promos',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Main Page',
    path: '/pages',
    icon: icon('ic-blog'),
  },
  {
    title: 'About Page',
    path: '/about',
    icon: icon('ic-blog'),
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: icon('ic-blog'),
  },
  {
    title: 'Banner Page',
    path: '/banner',
    icon: icon('ic-blog'),
  },
  {
    title: 'Voucher',
    path: '/voucher',
    icon: icon('ic-voucher'),
  },
  {
    title: 'Delivery',
    path: '/delivery',
    icon: icon('ic-cart'),
  },
  {
    title: 'Social Media',
    path: '/social',
    icon: icon('ic-blog'),
  },
];
