import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import UpdateProductView from 'src/sections/product/view/update-product-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Products - ${CONFIG.appName}`}</title>
      </Helmet>

      <UpdateProductView />
    </>
  );
}
