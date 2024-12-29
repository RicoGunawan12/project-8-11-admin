import { Box, Button, Card, Table, TableBody, TableContainer, TablePagination, Typography } from "@mui/material";
import { applyFilter, emptyRows, getComparator, UserPageNumbers, UserPageProps, UserProps } from "../utils";
import { Iconify } from "src/components/iconify";
import { UserTableToolbar } from "../user-table-toolbar";
import { Scrollbar } from "src/components/scrollbar";
import { UserTableHead } from "../user-table-head";
import { UserTableRow } from "../user-table-row";
import { TableEmptyRows } from "../table-empty-rows";
import { TableNoData } from "../table-no-data";
import { useCallback, useEffect, useState } from "react";
import { useToaster } from "src/components/toast/Toast";
import axios from "axios";

export function ShowUserView({ currPage, changePage, updateSignal, handleUpdate }: UserPageProps) {
    const table = useTable();
    const { showErrorToast, showSuccessToast } = useToaster();

    const [users, setUsers] = useState<UserProps[]>([]);
    const [filterName, setFilterName] = useState<string>('');

    const dataFiltered: UserProps[] = applyFilter({
        inputData: users,
        comparator: getComparator(table.order, table.orderBy),
        filterInput: filterName,
    });
    
    useEffect(() => {
        const getUsers = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}`);
            setUsers(response.data);
            console.log(response.data);
          } catch (error) {
            showErrorToast(error.message);
          }
        };
    
        getUsers();
    }, [updateSignal]);
    
    const notFound = !dataFiltered.length && !!filterName;

    return (
      <>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Users
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => changePage(UserPageNumbers.INSERT_PAGE_VIEW)}
          >
            New user
          </Button>
        </Box>

        <Card>
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={users.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      users.map((user) => user.userId)
                    )
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'E-mail' },
                    { id: 'phone', label: 'Phone Number' },
                    { id: 'role', label: 'Role' },
                    { id: 'action', label: 'Action', align: 'left' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.userId}
                        row={row}
                        selected={table.selected.includes(row.userId)}
                        onSelectRow={() => table.onSelectRow(row.userId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={users.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </>
    );  
}

export function useTable() {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
    const onSort = useCallback(
      (id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      },
      [order, orderBy]
    );
  
    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
      if (checked) {
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    }, []);
  
    const onSelectRow = useCallback(
      (inputValue: string) => {
        const newSelected = selected.includes(inputValue)
          ? selected.filter((value) => value !== inputValue)
          : [...selected, inputValue];
  
        setSelected(newSelected);
      },
      [selected]
    );
  
    const onResetPage = useCallback(() => {
      setPage(0);
    }, []);
  
    const onChangePage = useCallback((event: unknown, newPage: number) => {
      setPage(newPage);
    }, []);
  
    const onChangeRowsPerPage = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        onResetPage();
      },
      [onResetPage]
    );
  
    return {
      page,
      order,
      onSort,
      orderBy,
      selected,
      rowsPerPage,
      onSelectRow,
      onResetPage,
      onChangePage,
      onSelectAllRows,
      onChangeRowsPerPage,
    };
}
