import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VoucherView } from 'src/sections/voucher/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Voucher - ${CONFIG.appName}`}</title>
      </Helmet>

      <VoucherView />
    </>
  );
}
