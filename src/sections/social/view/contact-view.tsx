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

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../social-table-row';
import { UserTableHead } from '../social-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { SocialTableToolbar } from '../social-table-toolbar';
import { emptyRows, applyFilter, getComparator, ProductProps } from '../utils';

import type { SocialProps } from '../social-table-row';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { FormControl, InputAdornment, InputLabel, Modal, OutlinedInput, TextField } from '@mui/material';
import { maxHeaderSize } from 'node:http';
import Cookies from 'js-cookie';
import { Dayjs } from 'dayjs';
import ImageInput from 'src/components/input/ImageInput';
import { CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(200px, 80%, 500px)',
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


export function SocialView() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdate = () => {
    setOpenUpdate(true)
    setContactImage(null);
  }
  const handleCloseUpdate = () => setOpenUpdate(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [toDelete, setToDelete] = useState("");
  
  const [currPage, setCurrPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState<{contactId: string, contact: string, contactAccount: string, contactImage: string}[]>([]);
  const [contactToSend, setContactToSend] = useState<{contactId: string, email: string, phone: string}>();

  const [contact, setContact] = useState("");
  const [contactAccount, setContactAccount] = useState("");
  const [contactImage, setContactImage] = useState<File | null>(null);
  const [contactId, setContactId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingContactToSend, setLoadingContactToSend] = useState(false);

  const [update, setUpdate] = useState(false);
  const { showErrorToast, showSuccessToast, showLoadingToast } = useToaster();
  const table = useTable();

  useEffect(() => {
    async function getContacts() {
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/contacts`);
        setContacts(response.data.contacts);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getContacts();

    async function getContactToSend() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/contacts/admin`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setContactToSend(response.data.contact);
        console.log(response.data.contact)
      } catch (error) {
        if (error.status === 401) {
          nav('/')
        }
        showErrorToast(error.message);
      }
    }
    getContactToSend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const [filterName, setFilterName] = useState('');

  const dataFiltered: {contactId: string, contact: string, contactAccount: string, contactImage: string}[] = applyFilter({
    inputData: contacts,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleInsertContact = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append('contact', contact);
      body.append('contactAccount', contactAccount);
      if (contactImage) {
        body.append('contactImage', contactImage);
      }
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/contacts`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("New contact added!");
      handleClose()
      setContact("");
      setContactAccount("");
      setContactImage(null);
      setUpdate(!update)
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.message);
    }
    setLoading(false);
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    setContactImage(file);
  }

  const handleUpdate = async (id: string, contact: string, contactAccount: string, contactImage: string) => {
    handleOpenUpdate();
    setContact(contact);
    setContactAccount(contactAccount);
    setContactId(id);
    setContactImage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${contactImage}`))
  }

  const handleUpdateContact = async () => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("contact", contact)
      body.append("contactAccount", contactAccount)
      if (contactImage) {
        body.append("contactImage", contactImage)
      }
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/contacts/${contactId}`, body, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      console.log(response);
      
      showSuccessToast("Contact updated!");
      window.location = window.location
      setContact("");
      setContactAccount("");
      setContactId("");
      setContactImage(null);
      setUpdate(!update)
      handleCloseUpdate()
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.response.data.message);
    }
    setLoading(false);
  }

  const handleOpenDeleteModal = async (id: string) => {
    setToDelete(id);
    handleOpenDelete();
  }

  const handleDeleteContact = async () => {
    try {
      const response = axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/contacts/${toDelete}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });

      await showLoadingToast(response, {
        pending: "Deleting social media...",
        success: "Social media deleted successfully!",
        error: "Error deleting social media!",
      });
      
      // showSuccessToast("Contact deleted!");
      setToDelete("");
      handleCloseDelete();
      setUpdate(!update)
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.response.data.message);
    }
  }

  const handleUpdateContactToSend = async () => {
    setLoadingContactToSend(true);
    try {
      const body = {
        email: contactToSend?.email,
        phone: contactToSend?.phone
      }
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/contacts/admin/${contactToSend?.contactId}`, body, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      
      showSuccessToast("Contact to send updated!");
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      showErrorToast(error.response.data.message);
    }
    setLoadingContactToSend(false);
  }

  async function convertToFile(url: string) {
    // Fetch the image as a Blob
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
  
    // Convert the response to a Blob
    const blob = await response.blob();
  
    // Create a new File object from the Blob
    const file = new File([blob], "test", { type: blob.type });
  
    return file;
  }


  return (
    <DashboardContent>
      {
        currPage === 1 ?
        <div>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Social Media
            </Typography>

          </Box>


          <Box>
            <Typography variant="h6" flexGrow={1}>
              Contact Person
            </Typography>

            <Box display="flex" gap={5} mt={3} mb={3}>
              <Box>
                <TextField
                  fullWidth
                  name="contactAccount"
                  label="Email"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setContactToSend((prev: any) => ({
                      ...prev,
                      email: e.target.value,
                  }))}
                  placeholder='tyeso@gmail.com'
                  value={contactToSend?.email}
                />
                <Typography variant="caption">
                  This email is used to receive message from customer through gmail
                </Typography>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  name="contactAccount"
                  label="Phone"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setContactToSend((prev: any) => ({
                      ...prev,
                      phone: e.target.value,
                  }))}
                  placeholder='+628132456789'
                  value={contactToSend?.phone}
                />
                <Typography variant="caption">
                  This phone is used to redirect customer to Whatsapp
                </Typography>
              </Box>
            </Box>
            <Button color='inherit' variant='contained' style={{ width: '150px' }} onClick={handleUpdateContactToSend} disabled={loadingContactToSend}>
            {loadingContactToSend ? <CircularProgress size={24} /> : "Update Contact"}
            </Button>
          </Box>

          <hr style={{ marginTop: '30px' }} />

          <Typography variant="h6" flexGrow={1} style={{ marginTop: '10px' }}>
            Social Media Platforms
          </Typography>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'end', padding: '10px'}}>
            <Button color='inherit' variant='contained' onClick={handleOpen}>+ New Social Media</Button>
          </div>
          <Card>
            
            <SocialTableToolbar
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
                      { id: 'contact', label: 'Social Media' },
                      { id: 'contactAccount', label: 'Link' },
                      { id: 'action', label: 'Action', align: 'center' }
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
                          key={row.contactId}
                          row={row}
                          selected={table.selected.includes(row.contactId)}
                          onSelectRow={() => table.onSelectRow(row.contactId)}
                          handleUpdateContact={handleUpdate}
                          handleDeleteContact={handleOpenDeleteModal}
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Insert New Contact
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
            <div style={{ marginTop: '35px', gap: '20px'}}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                <ImageInput onChange={handleChangeImage} initialFile={contactImage} name="Contact image" width="250px" height="250px"/>
              </div>
              <div>
                <Typography id="modal-modal-title" variant="caption" marginBottom={'20px'} textAlign={'center'} component="h2">
                    1 : 1 resolution
                </Typography>
              </div>


              <TextField
                fullWidth
                name="contact"
                label="Contact"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setContact(e.target.value)}
                style={{ marginBottom: '20px'}}
                placeholder='Twitter'
              />

              <TextField
                fullWidth
                name="contactAccount"
                label="Contact Account"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setContactAccount(e.target.value)}
                style={{ marginBottom: '20px'}}
                placeholder='https://test.com'
              />
            </div>

            <div style={{ display: 'flex', gap:'20px', width: '100%', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleClose}>Close</Button>
              <Button variant="contained" onClick={handleInsertContact} style={{ width: '80px' }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Insert"}
              </Button>
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
              Delete Social Media
            </Typography>

            <div style={{ marginTop: '40px'}}>Are you sure want to delete this social media?</div>  
          
            <div style={{ display: 'flex', gap: '10px', marginTop: '35px',  justifyContent: 'center' }}>
              <Button variant="contained" style={{ margin: '20px 0'}} onClick={handleCloseDelete}>Cancel</Button>
              <Button color="error" variant="contained" style={{ margin: '20px 0'}} disabled={loading} onClick={handleDeleteContact}>{loading ? <CircularProgress size={24} /> : "Delete"}</Button>
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
            Update Contact
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', height:'80%'}}>
            <div style={{ marginTop: '35px', gap: '20px'}}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                <ImageInput onChange={handleChangeImage} initialFile={contactImage} name="Contact image" width="250px" height="250px"/>
              </div>
              <TextField
                fullWidth
                name="contact"
                label="Contact"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setContact(e.target.value)}
                style={{ marginBottom: '20px'}}
                placeholder='Twitter'
                value={contact}
              />

              <TextField
                fullWidth
                name="contactAccount"
                label="Contact Account"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setContactAccount(e.target.value)}
                style={{ marginBottom: '20px'}}
                placeholder='https://test.com'
                value={contactAccount}
              />
            </div>

            <div style={{ display: 'flex', gap:'20px', width: '100%', justifyContent: 'end' }}>
              <Button color="error" variant="contained" onClick={handleCloseUpdate}>Close</Button>
              <Button variant="contained" onClick={handleUpdateContact} style={{ width: '80px' }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Update"}
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
