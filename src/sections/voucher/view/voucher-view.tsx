import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyFilter, emptyRows, getComparator, VoucherProps } from "../utils";
import { useToaster } from "src/components/toast/Toast";
import axios from "axios";
import { DashboardContent } from "src/layouts/dashboard";
import { Box, Button, Card, Modal, Table, TableBody, TableContainer, TablePagination, Typography } from "@mui/material";
import { UserTableToolbar } from "../user-table-toolbar";
import { Scrollbar } from "src/components/scrollbar";
import { UserTableHead } from "../user-table-head";
import { UserTableRow } from "../user-table-row";
import { TableEmptyRows } from "../table-empty-rows";
import { TableNoData } from "../table-no-data";
import InsertVoucherView from "./insert-voucher-view";
import { Iconify } from "src/components/iconify";

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

export function VoucherView() {

  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [currPage, setCurrPage] = useState(1);
  const [vouchers, setVouchers] = useState<VoucherProps[]>([]);
  const [voucher, setVoucher] = useState<VoucherProps>();
  const [update, setUpdate] = useState(false);
  const { showErrorToast, showSuccessToast } = useToaster();
  const table = useTable();

  useEffect(() => {
    async function getVouchers() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/vouchers`);
        setVouchers(response.data);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const [filterName, setFilterName] = useState('');

  const dataFiltered: VoucherProps[] = applyFilter({
    inputData: vouchers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleEditVoucher = async (id: string, code : string) => {
    console.log(code)
    try {
      nav(`/voucher/${code}`)
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleDeleteVoucher = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/vouchers`, {
        data: {
          code: id
        }
      });
      showSuccessToast('Voucher deleted successfully');
      setUpdate(!update); // Trigger data refresh
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <DashboardContent>
      {currPage === 1 ? (
        <div>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Vouchers
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setCurrPage(0)}
            >
              New Voucher
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
                    rowCount={vouchers.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        vouchers.map((voucher) => voucher.voucherId)
                      )
                    }
                    headLabel={[
                      { id: 'voucherId', label: 'Voucher Id' },
                      { id: 'voucherCode', label: 'Voucher Code' },
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
                          key={row.voucherId}
                          row={row}
                          selected={table.selected.includes(row.voucherId)}
                          onSelectRow={() => table.onSelectRow(row.voucherId)}
                          handleDelete={handleDeleteVoucher}
                          handleUpdate={handleEditVoucher}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, vouchers.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={table.page}
              count={vouchers.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Card>
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => setCurrPage(1)}
          >
            Back
          </Button>

          <InsertVoucherView changePage={setCurrPage} handleUpdate={() => setUpdate(!update)} />
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Voucher
          </Typography>

          {/* Add voucher-specific modal content */}
          <Button variant="contained" style={{ margin: '20px 0' }} onClick={handleClose}>
            Update
          </Button>
        </Box>
      </Modal>
    </DashboardContent>
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
