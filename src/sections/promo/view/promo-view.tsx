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
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { Avatar, FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, TextField } from '@mui/material';
import { maxHeaderSize } from 'node:http';
import Cookies from 'js-cookie';
import { Dayjs } from 'dayjs';
import InsertPromoView from './insert-promo-view';

// ----------------------------------------------------------------------


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(400px, 80%, 600px)',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  maxHeight: '800px',
  overflowY: 'auto',
  borderRadius: 2,
  boxShadow: 24,
  py: 4,
  px: 4
};

export type PromoProps = {
  promoId: string
  promoName: string
  promoAmount: number
  startDate: Date
  endDate: Date
  promo_details: {
    promoId: string
    productId: string
    product: {
      productName: string
      defaultImage: string
      product_variants: {
        productImage: string
        productSize: string
        productColor: string
        productPrice: number
      }[]
    }
  }[]
}

export function PromoView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [currPage, setCurrPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [promo, setPromo] = useState<PromoProps>();
  const [promos, setPromos] = useState<PromoProps[]>([]);
  const [update, setUpdate] = useState(false);
  const { showErrorToast, showSuccessToast } = useToaster();
  const table = useTable();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/promos`);
        setPromos(response?.data.promos);
        console.log(promos);
      } catch (error) {
        showErrorToast(error.response.data.message);
      }
    }
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const [filterName, setFilterName] = useState('');

  const dataFiltered: PromoProps[] = applyFilter({
    inputData: promos,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // const handleUpdatePromo = async (id: string, isPromo: boolean, productPromo: number, startDate: Dayjs | null, endDate: Dayjs | null) => {
  const handleUpdatePromo = async () => {
    try {
      
      // const body = {
      //   id: id,
      //   isPromo: isPromo,
      //   productPromo: productPromo,
      //   startDate: startDate?.format("YYYY-MM-DD"),
      //   endDate: endDate?.format("YYYY-MM-DD")
      // }
      // console.log(body);
      
      // const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/promo/${id}`, body, {
      //     headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${Cookies.get("tys-token")}`,
      //     },
      // });
      showSuccessToast("Promo applied!");
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.response.data.message);
    }
  }

  const handleDeletePromo = async (promoId: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/promos/${promoId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setUpdate(!update);
        showSuccessToast("Promo deleted!");
      } catch (error) {
        if (error.status === 401) {
          nav('/');
        }
        showErrorToast(error.response.data.message);
      }
  }

  const handlePromoDetail = async (promo: PromoProps) => {
    setPromo(promo);
    handleOpen();
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

            <div>
              <Button color='inherit' variant='contained' onClick={() => setCurrPage(0)}>+ New Promo</Button>
            </div>
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
                      { id: 'promoName', label: 'Promo Name' },
                      // { id: 'productCategory', label: 'Product Category' },
                      { id: 'promoAmount', label: 'Promo Amount' },
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
                          key={row.promoId}
                          row={row}
                          selected={table.selected.includes(row.promoId)}
                          onSelectRow={() => table.onSelectRow(row.promoId)}
                          handlePromoDetail={handlePromoDetail}
                          handleDeletePromo={handleDeletePromo}
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

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h5" component="h2">
                Promo Detail
              </Typography>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
                <Typography style={{ margin: '15px 0'}} id="modal-modal-title" variant="h6" component="h2">
                  Promo Amount: Rp { promo?.promoAmount }
                </Typography>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                  {
                    promo?.promo_details.map((det, index) => {
                      console.log(det)
                      return <div key={det.productId} style={{ width: '100%' }}>
                        <div style={{ margin: '10px 0' }}>Product {index + 1}</div>
                        <div style={{ display:'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                          <Avatar style={{ width: '70px', height: '70px' }} src={import.meta.env.VITE_BACKEND_API + det.product.defaultImage} alt={det.product.productName} />
                          <div>{det.product.productName}</div>
                        </div>

                        {
                          det.product.product_variants.map((v) => {
                            return <div style={{ display:'flex', alignItems: 'center', width: '100%', marginTop: '10px', justifyContent: 'space-between', padding: '10px 40px'}}>
                              <div style={{ display:'flex', alignItems: 'center', gap: '10px' }}>
                                <Avatar style={{ width: '70px', height: '70px' }} src={import.meta.env.VITE_BACKEND_API + v.productImage} alt={det.product.productName} />
                                <div>{v.productSize} - {v.productColor}</div>
                              </div>

                              <div style={{ display:'flex', gap: '10px'}}>
                                <div><s style={{ color: 'gray' }}>Rp { v.productPrice }</s></div>
                                <div style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>Rp { v.productPrice - promo.promoAmount < 0 ? 0 : v.productPrice - promo.promoAmount }</div>
                              </div>
                            </div>
                          })
                        }
                      </div>
                    })
                  }
                </div>

                <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
                  <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
                </div>
              </div>

            </Box>
          </Modal>
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
                        
          <InsertPromoView changePage={setCurrPage} handleUpdate={() => setUpdate(!update)}/>
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
