import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BannerView } from 'src/sections/banner/view';
import { PageView } from 'src/sections/page/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Banner - ${CONFIG.appName}`}</title>
      </Helmet>

        <BannerView/>
    </>
  );
}
