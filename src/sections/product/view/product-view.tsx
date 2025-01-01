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
import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ProductTableToolbar } from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator, ProductProps } from '../utils';

import InsertProductView from './insert-product-view';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { CircularProgress, FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, TextField } from '@mui/material';
import { maxHeaderSize } from 'node:http';
import Cookies from 'js-cookie';

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

const styleDelete = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  minHeight: 250,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 2,
  boxShadow: 24,
  py: 4,
  px: 4
};


export function ProductsView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [toDelete, setToDelete] = useState("");
  
  const [currPage, setCurrPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState<ProductProps>();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showErrorToast, showSuccessToast, showLoadingToast } = useToaster();
  const table = useTable();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}?status=all`);
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

  const handleEditVariant = async (id: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products/${id}`);
      setProduct(response.data);
      handleOpen();
    } catch (error) {
      showErrorToast(error.message);
    }
  } 

  const handleUpdateVariant = async () => {
    setLoading(true);
    if (!product) {
      return;
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/update/variant`, product?.product_variants, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("tys-token")}`,
        },
      });
      
      
      // setProduct(response.data);
      showSuccessToast("Variant updated!");
      setProduct(undefined);
      handleClose();
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      console.log(error);
      
      showErrorToast(error.message);
    }
    setLoading(false);
  }
  
  const handleInputChange = (
    index: number,
    field: keyof ProductProps['product_variants'][0], // Type fixed for better readability
    value: string | number
  ) => {
    if (!product) return;
    if (typeof value === 'number' && value < 0) return;

    const updatedVariants = [...product.product_variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setProduct((prev) => prev ? { ...prev, product_variants: updatedVariants } : prev);
    
  };

  const handleOpenDeleteModal = async (id: string) => {
    setToDelete(id);
    handleOpenDelete();
  }

  const handleDeleteProduct = async () => {
    try {
      const response = axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/products/${toDelete}`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("tys-token")}`,
          },
      });
      await showLoadingToast(response, {
        pending: "Deleting product...",
        success: "Product deleted successfully!",
        error: "Error deleting product!",
      });
      // showSuccessToast("Product Deleted!");
      setToDelete("");
      handleCloseDelete();
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.message);
    }
  }

  const handleUpdateBestSeller = async (id: string, isBestSeller: boolean) => {
    try {
      const body = {
        isBestSeller
      };
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/update/bestseller/${id}`, body, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("tys-token")}`,
          },
      });
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.message);
    }
  }

  return (
    <DashboardContent>
      {
        currPage === 1 ?
        <div>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Products
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setCurrPage(0)}
            >
              New Product
            </Button>
          </Box>

          <Card>
            <ProductTableToolbar
              itemsSelected={table.selected}
              numSelected={table.selected.length}
              filterName={filterName}
              onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFilterName(event.target.value);
                table.onResetPage();
              }}
              onUpdate={() => setUpdate(!update)}
            />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <ProductTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={products.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        products.map((product: ProductProps) => product.productId)
                      )
                    }
                    headLabel={[
                      { id: 'productName', label: 'Product Name' },
                      { id: 'productCategory', label: 'Product Category' },
                      { id: 'variant', label: 'Update Variant Price & Stock' },
                      { id: 'bestSeller', label: 'Best Seller' },
                      { id: 'status', label: 'Status' },
                      // { id: 'promo', label: 'Promo' },
                      // { id: 'promoExpiry', label: 'Promo Expiry' },
                      { id: 'action', label: 'action' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, index) => (
                        <ProductTableRow
                          key={row.productId}
                          row={row}
                          selected={table.selected.includes(row.productId)}
                          onSelectRow={() => table.onSelectRow(row.productId)}
                          handleEditVariant={handleEditVariant}
                          handleDeleteProduct={handleOpenDeleteModal}
                          handleUpdateBestSeller={handleUpdateBestSeller}
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
          
          <InsertProductView changePage={setCurrPage} handleUpdate={() => setUpdate(!update)}/>
        </div>
      }

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update {product?.productName} Variant 
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%', marginTop:'20px'}}>
            <table>
              {
                product?.product_variants.map((variant, index) => {
                  return <tr key={variant.productVariantId}>
                        <td>{`${variant.productColor}`}</td>
                        <td style={{ padding: '10px', width: '350px'}}>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <Button style={{ fontSize: '16px'}} onClick={(e) => handleInputChange(index, "productStock", variant.productStock - 1)}>-</Button>
                            <OutlinedInput
                                endAdornment={<InputAdornment position="end">pcs</InputAdornment>}
                                style={{ height: '55px'}}
                                placeholder="Stock"
                                type="number"
                                value={variant.productStock}
                                onChange={(e) => handleInputChange(index, "productStock", parseInt(e.target.value))}
                                />
                            <Button style={{ fontSize: '16px'}} onClick={(e) => handleInputChange(index, "productStock", variant.productStock + 1)}>+</Button>
                          </div>
                        </td>
                        <td>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                                label="Amount"
                                value={variant.productPrice}
                                onChange={(e) => handleInputChange(index, "productPrice", parseInt(e.target.value))}
                            />
                        </FormControl>
                        </td>
                      </tr>
                })
              }
            </table> 

            <Button variant="contained" style={{ margin: '20px 0'}} disabled={loading} onClick={handleUpdateVariant}>{loading ? <CircularProgress size={24} /> : "Update"}</Button>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
            </div>
          </div>

        </Box>
      </Modal>

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDelete}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete Product 
            </Typography>

            <div style={{ marginTop: '40px'}}>Are you sure want to delete this product?</div>  
          
            <div style={{ display: 'flex', gap: '10px', marginTop: '35px',  justifyContent: 'center' }}>
              <Button variant="contained" style={{ margin: '20px 0'}} onClick={handleCloseDelete}>Cancel</Button>
              <Button color="error" variant="contained" style={{ margin: '20px 0'}} disabled={loading} onClick={handleDeleteProduct}>{loading ? <CircularProgress size={24} /> : "Delete"}</Button>
            </div>
        </Box>
      </Modal>
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
