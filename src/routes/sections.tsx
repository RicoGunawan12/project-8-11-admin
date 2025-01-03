import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import UpdateProductView from 'src/sections/product/view/update-product-view';
import UpdateBlogView from 'src/sections/blog/view/update-blog-view';
import { DeliveryView } from 'src/sections/delivery/view';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const CategoriesPage = lazy(() => import('src/pages/categories'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const TransactionsPage = lazy(() => import('src/pages/transaction'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const VoucherPage = lazy(() => import('src/pages/voucher'));
export const DeliveryPage = lazy(() => import('src/pages/delivery'));
export const PromoPage = lazy(() => import('src/pages/promo'));
export const UpdateVoucherView = lazy(() => import('src/pages/voucher'));
export const PagePage = lazy(() => import('src/pages/page'));
export const SocialPage = lazy(() => import('src/pages/social'));
export const AboutPage = lazy(() => import('src/pages/about'));
export const BannerPage = lazy(() => import('src/pages/banner'));
export const FAQPage = lazy(() => import('src/pages/faq'));
export const UpdatePromoPage = lazy(() => import('src/pages/update-promo'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'transactions', element: <TransactionsPage /> },
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/:id', element: <UpdateProductView /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'promos', element: <PromoPage /> },
        { path: 'promos/:id', element: <UpdatePromoPage /> },
        { path: 'pages', element: <PagePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'banner', element: <BannerPage /> },
        { path: 'social', element: <SocialPage /> },
        { path: 'blog/:id', element: <UpdateBlogView /> },
        { path: 'delivery', element: <DeliveryView /> },
        { path: 'voucher', element: <VoucherPage /> },
        { path: 'voucher/:id', element: <UpdateVoucherView /> },
        { path: 'faq', element: <FAQPage /> },
        
      ],
    },
    {
      path: '/',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
