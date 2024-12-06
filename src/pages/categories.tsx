import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CategoriesView } from 'src/sections/category/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Categories - ${CONFIG.appName}`}</title>
      </Helmet>

      <CategoriesView />
    </>
  );
}
