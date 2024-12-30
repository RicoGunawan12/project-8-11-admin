import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Modal from '@mui/material/Modal';
import TablePagination from '@mui/material/TablePagination';
import { CircularProgress, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

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
import ImageInput from 'src/components/input/ImageInput';

// ----------------------------------------------------------------------

const style = {
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

export function CategoriesView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [toDelete, setToDelete] = useState("");
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);


  const [loading, setLoading] = useState(false);

  const [currUpdateId, setCurrUpdateId] = useState('');
  const [currUpdateName, setCurrUpdateName] = useState('');
  const [currPhoto, setCurrPhoto] = useState<File | null>(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = async (id: string, name: string, photo: string) => {
    setCurrUpdateId(id);
    setCurrUpdateName(name);
    setCurrPhoto(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${photo}`) ?? null)
    setOpenUpdate(true);
  }
  const handleCloseUpdate = () => setOpenUpdate(false);

  const table = useTable();
  const { showErrorToast, showSuccessToast, showLoadingToast } = useToaster();
  const [update, setUpdate] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [categories, setCategories] = useState<{ productCategoryId: string, productCategoryName: string, productCategoryPhoto: string}[]>([]);
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/categories`);
        setCategories(response.data);
        
        console.log(response.data);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const handleInsertCategory = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append('productCategoryName', category);
      if (photo) {
        body.append('productCategoryPhoto', photo);
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/categories`, body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      setPhoto(null);
      showSuccessToast(response.data.message);
      setOpen(false);
      setUpdate(!update);
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');
        showErrorToast("Unauthorized");
      }
      else {
        showErrorToast(error.response.data.message);
      }
    }
    setLoading(false);
  }

  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append('productCategoryName', currUpdateName);
      if (currPhoto) {
        body.append('productCategoryPhoto', currPhoto);
      }
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/categories/${currUpdateId}`, body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      setCurrUpdateId('');
      setCurrUpdateName('');
      showSuccessToast(response.data.message);
      setOpenUpdate(false);
      setUpdate(!update);
      window.location = window.location
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.message);
    }
    setLoading(false);
  }

  const handleOpenDeleteModal = async (id: string) => {
    setToDelete(id);
    handleOpenDelete();
  }

  const handleDeleteCategory = async () => {
    
    try {
      const body = {
        category
      }
      const response = axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/categories/${toDelete}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      await showLoadingToast(response, {
        pending: "Deleting category...",
        success: "Category deleted successfully!",
        error: "Error deleting category!",
      });

      // showSuccessToast(response.data.message);
      setToDelete("");
      handleCloseDelete();
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.message);
    }
  }

  const dataFiltered: { productCategoryId: string, productCategoryName: string, productCategoryPhoto: string}[] = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;


  async function convertToFile(url: string) {
    // Fetch the image as a Blob
    try {
      const response = await fetch(url);
    
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
    
      // Convert the response to a Blob
      const blob = await response.blob();
    
      // Create a new File object from the Blob
      const file = new File([blob], "test", { type: blob.type });
    
      return file;
    } catch (error) {
      return null;
    }
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Categories
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          New Category
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
                  // { id: 'categoryId', label: 'Category ID' },
                  { id: 'category', label: 'Category' },
                  { id: 'action', label: 'Action' }
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
                      key={row.productCategoryId}
                      row={row}
                      selected={table.selected.includes(row.productCategoryId)}
                      onSelectRow={() => table.onSelectRow(row.productCategoryId)}
                      handleDelete={handleOpenDeleteModal}
                      handleUpdate={handleOpenUpdate}
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Insert New Category
          </Typography>

          <div style={{ display: 'flex', marginTop: '35px', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput name='Category Photo' width='300px' height='400px' initialFile={photo} onChange={(e: any) => setPhoto(e.target.files[0])}/>
            </div>

            <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                300 x 400 (px) resolution
              </Typography>
            </div>

            <div style={{ gap: '20px', marginTop: '20px'}}>
              <TextField
                fullWidth
                name="category"
                label="Category"
                
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setCategory(e.target.value)}
              />

            </div>

            <div style={{ display: 'flex', width: '100%', marginTop: '20px', gap: '10px', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
              <Button variant="contained" onClick={handleInsertCategory} disabled={loading} style={{ width: '75px'}}>{loading ? <CircularProgress size={24} /> : "Insert"}</Button>
            </div>
          </div>

        </Box>
      </Modal>


      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Category
          </Typography>

          <div style={{ display: 'flex', marginTop: '35px', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ImageInput name='Category Photo' width='300px' height='400px' initialFile={currPhoto} onChange={(e: any) => setCurrPhoto(e.target.files[0])}/>
              </div>

              <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  300 x 400 (px) resolution
                </Typography>
              </div>

              <div style={{ marginTop: '20px' }}>
                <TextField
                  fullWidth
                  name="category"
                  label="Category"
                  InputLabelProps={{ shrink: true }}
                  value={currUpdateName}
                  onChange={(e) => setCurrUpdateName(e.target.value)}
                />
              </div>

              

            <div style={{ display: 'flex', width: '100%', justifyContent: 'end', marginTop: '20px', gap: '10px' }}>
              <Button color="error" variant="contained" onClick={handleCloseUpdate}>Close</Button>
              <Button variant="contained" onClick={handleUpdateCategory} disabled={loading} style={{ width: '75px'}}>{loading ? <CircularProgress size={24} /> : "Update"}</Button>
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Category
          </Typography>

          <div style={{ marginTop: '30px'}}>
            Are you sure want to delete this category?
          </div>

          <div style={{ display: 'flex', marginTop: '35px', flexDirection: 'column', justifyContent:'space-between'}}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
              <Button variant="contained" onClick={handleCloseDelete}>Cancel</Button>
              <Button color="error" variant="contained" onClick={handleDeleteCategory} disabled={loading} style={{ width: '75px'}}>{loading ? <CircularProgress size={24} /> : "Delete"}</Button>
            </div>
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
