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
import { VoucherProps } from './utils';

// ----------------------------------------------------------------------

type VoucherTableRowProps = {
  row: VoucherProps;
  selected: boolean;
  onSelectRow: () => void;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, name: string) => void;
};

export function VoucherTableRow({ row, selected, onSelectRow, handleDelete, handleUpdate }: VoucherTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.voucherType}</TableCell>
        <TableCell>{row.voucherCode}</TableCell>
        <TableCell>{row.voucherStartDate.substring(0, 10)}</TableCell>
        <TableCell>{row.voucherEndDate.substring(0, 10)}</TableCell>
        <TableCell>{row.maxDiscount}</TableCell>
        <TableCell>{row.discount}</TableCell>
        <TableCell>{row.quota}</TableCell>


        <TableCell>
          <MenuItem onClick={() => handleUpdate(row.voucherId, row.voucherCode)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDelete(row.voucherCode)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </TableCell>

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        // onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* <MenuList
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
          
        </MenuList> */}
      </Popover>
    </>
  );
}
