import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ContactView } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Contacts - ${CONFIG.appName}`}</title>
      </Helmet>

      <ContactView/>
    </>
  );
}
