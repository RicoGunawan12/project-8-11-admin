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
import { TextField } from '@mui/material';
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

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 250,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  pt: 4,
  px: 4
};

export function VoucherView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [currUpdateId, setCurrUpdateId] = useState('');
  const [currUpdateName, setCurrUpdateName] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = (id: string, name: string) => {
    setCurrUpdateId(id);
    setCurrUpdateName(name);
    setOpenUpdate(true);
  }
  const handleCloseUpdate = () => setOpenUpdate(false);

  const table = useTable();
  const { showErrorToast, showSuccessToast } = useToaster();
  const [update, setUpdate] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [vouchers, setVouchers] = useState<{ voucherId: string, voucherName: string }[]>([]);
  const [voucher, setVoucher] = useState('');
  const [voucherType, setVoucherType] = useState('');
  const [voucherTypeName, setVoucherTypeName] = useState('')

  useEffect(() => {
    async function getVouchers() {
      console.log("Asdwa")
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/vouchers/getAllVouchers`);
        setVouchers(response.data);
        console.log(response.data);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const handleInsertVoucher = async () => {
    try {
      const body = {
        productVoucherName: voucher
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/vouchers/createVouchers`, body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

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
        showErrorToast(error.response.data.errors[0].msg);
      }
    }
  }

  const handleDeleteVoucher = async (id: string) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/vouchers/deleteVoucher/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      showSuccessToast(response.data.message);
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.message);
    }
  }

  const [openVoucherTypeModal, setOpenVoucherTypeModal] = useState(false);
  const handleOpenVoucherTypeModal = () => setOpenVoucherTypeModal(true);
  const handleCloseVoucherTypeModal = () => setOpenVoucherTypeModal(false);

  const handleInsertVoucherType = async () => {
    try {
      const body = {
        voucherTypes: [
          {
            voucherTypeName: voucherType,
            voucherTypeCode: voucherTypeName
          }
        ]
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/voucherTypes/createVoucherTypes`, body, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      showSuccessToast(response.data.message);
      setOpenVoucherTypeModal(false);
      setUpdate(!update);
    } catch (error) {
      console.log(error);

      if (error.status === 401) {
        nav('/');
        showErrorToast('Unauthorized');
      } else {
        showErrorToast(error.response.data.errors[0].msg);
      }
    }
  };

  const dataFiltered: { voucherId: string, voucherName: string }[] = applyFilter({
    inputData: vouchers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Vouchers
        </Typography>
        <div>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpen}
          >
            New Voucher
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenVoucherTypeModal}
            sx={{ ml: 2 }}
          >
            New Voucher Type
          </Button>
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
                  { id: 'voucherId', label: 'Voucher ID' },
                  { id: 'voucher', label: 'Voucher' },
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
                      key={row.voucherId}
                      row={row}
                      selected={table.selected.includes(row.voucherId)}
                      onSelectRow={() => table.onSelectRow(row.voucherId)}
                      handleDelete={handleDeleteVoucher}
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
            Insert New Voucher
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '80%' }}>
            <div style={{ display: 'flex', marginTop: '20px' }}>
              <TextField
                fullWidth
                name="voucher"
                label="Voucher"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setVoucher(e.target.value)}
              />

              <Button variant="contained" onClick={handleInsertVoucher}>Insert</Button>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
            </div>
          </div>

        </Box>
      </Modal>

      <Modal
        open={openVoucherTypeModal}
        onClose={handleCloseVoucherTypeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Insert New Voucher Type
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '80%' }}>
            <div style={{ display: 'flex', marginTop: '20px' }}>
              <TextField
                fullWidth
                name="voucherType"
                label="Voucher Type"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setVoucherType(e.target.value)}
              />

              <TextField
                fullWidth
                name="voucherTypeName"
                label="Voucher Type Name"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setVoucherTypeName(e.target.value)}
              />

              <Button variant="contained" onClick={handleInsertVoucherType}>
                Insert
              </Button>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleCloseVoucherTypeModal}>
                Close
              </Button>
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

  const onSelectAllRows = useCallback((checked: boolean, data: string[]) => {
    if (checked) {
      setSelected(data);
    } else {
      setSelected([]);
    }
  }, []);

  const onSelectRow = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => setPage(newPage), []);
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setRowsPerPage(+event.target.value),
    []
  );

  const onResetPage = useCallback(() => setPage(0), []);

  return {
    page,
    orderBy,
    rowsPerPage,
    selected,
    order,
    onSort,
    onSelectAllRows,
    onSelectRow,
    onChangePage,
    onChangeRowsPerPage,
    onResetPage
  };
}
