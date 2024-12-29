import React, { useState } from 'react';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { InsertUserView } from './insert-user-view';
import { ShowUserView } from './show-user-view';
import { UserPageNumbers } from '../utils';

// ----------------------------------------------------------------------

export function UserView() {
  const [currPage, setCurrPage] = useState<number>(1);
  const [updateSignal, setUpdateSignal] = useState<boolean>(false);

  const renderSubpage: (page: number) => React.JSX.Element = (page: number) => {
    switch (page) {
      case UserPageNumbers.INSERT_PAGE_VIEW: { // insert view
        return <InsertUserView currPage={currPage} changePage={setCurrPage} updateSignal={updateSignal} handleUpdate={() => setUpdateSignal(!updateSignal)} />;
      }
      case UserPageNumbers.SHOW_PAGE_VIEW: { // show view
        return <ShowUserView currPage={currPage} changePage={setCurrPage} updateSignal={updateSignal} handleUpdate={() => setUpdateSignal(!updateSignal)} />;
      }
      default: { // return nothing if unknown page number
        return <></>;
      }
    }
  }

  return (
    <DashboardContent>
      { renderSubpage(currPage) }
    </DashboardContent>
  );
}
