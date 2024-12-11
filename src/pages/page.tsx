import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PageView } from 'src/sections/page/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Pages - ${CONFIG.appName}`}</title>
      </Helmet>

        <PageView/>
    </>
  );
}
