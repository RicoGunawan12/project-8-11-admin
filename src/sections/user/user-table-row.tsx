import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { UserProps } from './utils';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdate: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onUpdate }: UserTableRowProps) {
  const { showErrorToast, showSuccessToast } = useToaster();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}/activate`, {
        userId
      }, {
        headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully activate account");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleDeactivateUser = async (userId: string) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}/deactivate`, {
        userId
      }, {
        headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully deactivate account");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {/* <Avatar alt={row.fullName} src={row.avatarUrl} /> */}
            {row.fullName}
          </Box>
        </TableCell>

        <TableCell>{row.email}</TableCell>

        <TableCell>{row.phone}</TableCell>

        <TableCell>{row.role.toUpperCase()}</TableCell>

        <TableCell>
          <div style={{ backgroundColor: (row.status === 'active') ? "#88E788" : "#EF9A9A", textAlign: "center", borderRadius: "8px", color: (row.status === 'active') ? "#008000" : "#D32F2F", fontWeight: "bold" }}>{row.status.toUpperCase()}</div>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
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
          {row.status === 'inactive' ? (
            <MenuItem onClick={() => handleActivateUser(row.userId)} sx={{ color: 'success.main' }}>
              <Iconify icon="solar:check-circle-linear" />
              Activate
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleDeactivateUser(row.userId)} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:close-circle-linear" />
              Deactivate
            </MenuItem>
          ) }
          

          
        </MenuList>
      </Popover>
    </>
  );
}
