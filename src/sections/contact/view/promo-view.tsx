import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator, ProductProps } from '../utils';

import type { UserProps } from '../user-table-row';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, TextField } from '@mui/material';
import { maxHeaderSize } from 'node:http';
import Cookies from 'js-cookie';
import { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(500px, 80%, 1000px)',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  maxHeight: '800px',
  overflowY: 'auto',
  borderRadius: 2,
  boxShadow: 24,
  py: 4,
  px: 4
};

export function PromoView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [currPage, setCurrPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState<ProductProps>();
  const [update, setUpdate] = useState(false);
  const { showErrorToast, showSuccessToast } = useToaster();
  const table = useTable();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products`);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const [filterName, setFilterName] = useState('');

  const dataFiltered: ProductProps[] = applyFilter({
    inputData: products,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleUpdatePromo = async (id: string, isPromo: boolean, productPromo: number, startDate: Dayjs | null, endDate: Dayjs | null) => {
    console.log(isPromo);
    try {
      
      const body = {
        id: id,
        isPromo: isPromo,
        productPromo: productPromo,
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD")
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/promo/${id}`, body, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
          },
      });
      showSuccessToast("Promo applied!");
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.response.data.message);
    }
  }

  return (
    <DashboardContent>
      {
        currPage === 1 ?
        <div>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Promo
            </Typography>
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
                    rowCount={_users.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        _users.map((user) => user.id)
                      )
                    }
                    headLabel={[
                      { id: 'productName', label: 'Product Name' },
                      // { id: 'productCategory', label: 'Product Category' },
                      { id: 'promo', label: 'Promo' },
                      { id: 'discount', label: 'Discount' },
                      // { id: 'promo', label: 'Promo' },
                      // { id: 'promoExpiry', label: 'Promo Expiry' },
                      { id: 'startDate', label: 'Start Date' },
                      { id: 'endDate', label: 'End Date' },
                      { id: 'action', label: 'Action' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, index) => (
                        <UserTableRow
                          key={row.productId}
                          row={row}
                          selected={table.selected.includes(row.productId)}
                          onSelectRow={() => table.onSelectRow(row.productId)}
                          handleUpdatePromo={handleUpdatePromo}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={table.page}
              count={_users.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Card>
        </div>
        :
        <div>
          <Button
              variant="contained"
              color="inherit"
              onClick={() => setCurrPage(1)}
            >
              Back
          </Button>
          
        </div>
      }

    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

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
