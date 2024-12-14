import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AboutView } from 'src/sections/about/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Contacts - ${CONFIG.appName}`}</title>
      </Helmet>

      <AboutView/>
    </>
  );
}
