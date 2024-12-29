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
import { TextareaAutosize } from '@mui/material';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  minHeight: 350,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: 2,
  boxShadow: 24,
  py: 4,
  px: 4
};

export function FAQView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [currUpdateId, setCurrUpdateId] = useState('');
  const [currUpdateFaqQuestion, setCurrUpdateFaqQuestion] = useState('');
  const [currUpdateFaqAnswer, setCurrUpdateFaqAnswer] = useState('');
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = (id: string, faqQuestion: string, faqAnswer: string) => {
    setCurrUpdateId(id);
    setCurrUpdateFaqQuestion(faqQuestion);
    setCurrUpdateFaqAnswer(faqAnswer);
    setOpenUpdate(true);
  }
  const handleCloseUpdate = () => setOpenUpdate(false);

  const table = useTable();
  const { showErrorToast, showSuccessToast, showLoadingToast } = useToaster();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [faqs, setFAQs] = useState<{ faqId: string, faqQuestion: string, faqAnswer: string }[]>([]);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  
  useEffect(() => {
    async function getFAQs() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/faqs`);
        setFAQs(response.data.allFAQ);
        console.log(response.data);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const handleInsertFAQ = async () => {
    setLoading(true);
    try {
      const body = {
        faqQuestion,
        faqAnswer
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/faqs`, body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
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
    setLoading(false);
  }

  const handleUpdateFAQ = async () => {
    setLoading(true);
    try {
      const body = {
        faqQuestion: currUpdateFaqQuestion,
        faqAnswer: currUpdateFaqAnswer,
      }
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/faqs/${currUpdateId}`, body,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      setCurrUpdateFaqAnswer('');
      setCurrUpdateFaqQuestion('');
      setCurrUpdateId('');
      showSuccessToast(response.data.message);
      setOpenUpdate(false);
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.message);
    }
    setLoading(false);
  }

  const handleDeleteFAQ = async (id: string) => {
    try {
      const response = axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/faqs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      await showLoadingToast(response, {
        pending: "Deleting FAQ...",
        success: "FAQ deleted successfully!",
        error: "Error deleting FAQ!",
      });
      // showSuccessToast(response.data.message);
      setUpdate(!update);
    } catch (error) {
      if (error.status === 401) {
        nav('/');
      }
      showErrorToast(error.message);
    }
  }

  const dataFiltered: { faqId: string, faqQuestion: string, faqAnswer: string }[] = applyFilter({
    inputData: faqs,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          FAQ
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpen}
        >
          New FAQ
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
                  { id: 'faq', label: 'FAq' },
                  { id: 'answer', label: 'Answer' },
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
                      key={row.faqId}
                      row={row}
                      selected={table.selected.includes(row.faqId)}
                      onSelectRow={() => table.onSelectRow(row.faqId)}
                      handleDelete={handleDeleteFAQ}
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
            Insert New FAQ
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
            <div>
              <div style={{ marginTop: '35px'}}>
                <TextField
                  fullWidth
                  name="question"
                  label="Question"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                />

              </div>
              <div style={{ marginTop: '10px'}}>
                <TextareaAutosize
                    style={{ borderRadius: '10px', border:'1px solid gray', width: '100%', marginTop: '15px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={3}  
                    // value={detail}
                    placeholder="Answer"
                    onChange={(e) => setFaqAnswer(e.target.value)}
                />

              </div>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'end', gap: '10px', marginTop: '20px' }}>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
              <Button variant="contained" style={{ width: '80px'}} disabled={loading} onClick={handleInsertFAQ}>{loading ? <CircularProgress size={24} /> : "Insert"}</Button>
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
            Update FAQ
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
            <div>
              <div style={{ marginTop: '35px'}}>
                <TextField
                  fullWidth
                  name="question"
                  label="Question"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setCurrUpdateFaqQuestion(e.target.value)}
                  value={currUpdateFaqQuestion}
                />

              </div>
              <div style={{ marginTop: '10px'}}>
                <TextareaAutosize
                    style={{ borderRadius: '10px', border:'1px solid gray', width: '100%', marginTop: '15px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={3}  
                    value={currUpdateFaqAnswer}
                    placeholder="Answer"
                    onChange={(e) => setCurrUpdateFaqAnswer(e.target.value)}
                />

              </div>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'end', gap: '10px', marginTop: '20px' }}>
              <Button color="error" variant="contained" onClick={handleCloseUpdate}>Close</Button>
              <Button variant="contained" style={{ width: '80px'}} onClick={handleUpdateFAQ} disabled={loading}>{loading ? <CircularProgress size={24} /> : "Update"}</Button>
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
