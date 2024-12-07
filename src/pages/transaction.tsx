import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// import { ProductsView } from 'src/sections/product/view';
import { TransactionView } from 'src/sections/transaction/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transactions - ${CONFIG.appName}`}</title>
      </Helmet>
      
      <TransactionView />
    </>
  );
}
