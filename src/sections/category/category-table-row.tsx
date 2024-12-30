import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type CategoryProps = {
  id: string;
  name: string;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type CategoryTableRowProps = {
  row: { productCategoryId: string, productCategoryName: string, productCategoryPhoto: string};
  selected: boolean;
  onSelectRow: () => void;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, name: string, photo: string) => void;
};

export function CategoryTableRow({ row, selected, onSelectRow, handleDelete, handleUpdate }: CategoryTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>


        <TableCell>
          <Box gap={2} display="flex" alignItems="center">
            <Avatar src={`${import.meta.env.VITE_BACKEND_API}${row.productCategoryPhoto}`}/> 
            {row.productCategoryName}
          </Box>
        </TableCell>


        <TableCell>
          <MenuItem onClick={() => handleUpdate(row.productCategoryId, row.productCategoryName, row.productCategoryPhoto)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDelete(row.productCategoryId)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </TableCell>
      </TableRow>
    </>
  );
}
