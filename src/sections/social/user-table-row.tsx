import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ProductProps } from './utils';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Switch } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: {contactId: string, contact: string, contactAccount: string, contactImage: string};
  selected: boolean;
  onSelectRow: () => void;
  handleUpdateContact: (id: string, contact: string, contactAccount: string) => void;
  handleDeleteContact: (id: string) => void;
};

export function UserTableRow({ row, selected, onSelectRow, handleUpdateContact, handleDeleteContact }: UserTableRowProps) {
  const nav = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);


  return (
    <>
      <style>
          {`
          .hover-pointer {
              cursor: pointer;
          }
          .hover-pointer:hover {
              cursor: pointer;
          }
          `}
      </style>
      <TableRow className='hover-pointer' hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar src={`${import.meta.env.VITE_BACKEND_API}${row.contactImage}`} alt={row.contact} />
            {row.contact}
          </Box>
        </TableCell>

        <TableCell><a href={row.contactAccount} target="_blank">{row.contactAccount}</a></TableCell>
        <TableCell><Button onClick={() => handleUpdateContact(row.contactId, row.contact, row.contactAccount)}>Update</Button></TableCell>
        <TableCell>
          <MenuItem onClick={() => handleDeleteContact(row.contactId)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </TableCell>


        {/* <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          
          <MenuItem onClick={() => handleDeleteProduct(row.productId)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </TableCell> */}
      </TableRow>

      {/* <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
