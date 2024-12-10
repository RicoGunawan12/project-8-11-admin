import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Categories - ${CONFIG.appName}`}</title>
      </Helmet>

        
    </>
  );
}
