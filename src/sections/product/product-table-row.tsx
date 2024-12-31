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
import { Button, Switch } from '@mui/material';

// ----------------------------------------------------------------------

type ProductTableRowProps = {
  row: ProductProps;
  selected: boolean;
  onSelectRow: () => void;
  handleEditVariant: (id: string) => void;
  handleDeleteProduct: (id: string) => void;
  handleUpdateBestSeller: (id: string, isBestSeller: boolean) => void;
};

export function ProductTableRow({ row, selected, onSelectRow, handleEditVariant, handleDeleteProduct, handleUpdateBestSeller }: ProductTableRowProps) {
  const nav = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleProductDetail = () => {
    nav('/products/' + row.productId);
  }
  console.log(row);
  

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
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row" onClick={handleProductDetail}>
          <Box gap={2} display="flex" alignItems="center">
            {/* <Avatar alt={row.productName} /> */}
            <img src={`${import.meta.env.VITE_BACKEND_API}${row.defaultImage}`} width={100} height={100}/>
            {row.productName}
          </Box>
        </TableCell>

        <TableCell onClick={handleProductDetail}>{row.product_category?.productCategoryName ? row.product_category.productCategoryName : 'Uncategorized'}</TableCell>

        <TableCell><Button onClick={() => handleEditVariant(row.productId)}>Edit Variant</Button></TableCell>

        <TableCell><Switch checked={row.isBestSeller} onChange={(e) =>  handleUpdateBestSeller(row.productId, e.target.checked)} /></TableCell>

        <TableCell>
          <div style={{ backgroundColor: (row.productActivityStatus === 'active') ? "#88E788" : "#EF9A9A", textAlign: "center", borderRadius: "8px", color: (row.productActivityStatus === 'active') ? "#008000" : "#D32F2F", fontWeight: "bold" }}>{row.productActivityStatus}</div>
        </TableCell>

        <TableCell align="right">
          {/* <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
          
          <MenuItem onClick={handleProductDetail}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteProduct(row.productId)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </TableCell>
      </TableRow>
    </>
  );
}
