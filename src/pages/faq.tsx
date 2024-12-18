import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { FAQView } from 'src/sections/faq/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`FAQ - ${CONFIG.appName}`}</title>
      </Helmet>

        <FAQView/>
    </>
  );
}
