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
import { PromoProps } from './view';

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
  row: PromoProps;
  selected: boolean;
  onSelectRow: () => void;
  handleUpdatePromo: (id: string, isPromo: boolean, productPromo: number, startDate: Dayjs | null, endDate: Dayjs | null) => void;
};

export function UserTableRow({ row, selected, onSelectRow, handleUpdatePromo }: UserTableRowProps) {
  const nav = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  
  // const [isPromo, setIsPromo] = useState<boolean | false>(row.isPromo);
  // const [productPromo, setProductPromo] = useState(row.productPromo);
  // const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(row.startDate ? row.startDate : new Date()));
  // const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(row.endDate ? row.endDate :new Date()));

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // const handleProductDetail = () => {
  //   nav('/products/' + row.productId);
  // }

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
            {/* <Avatar alt={row.productName} /> */}
            {/* <img src={`${import.meta.env.VITE_BACKEND_API}${row.defaultImage}`} width={100} height={100}/> */}
            {row.promoName}
          </Box>
        </TableCell>

        <TableCell>Rp {row.promoAmount}</TableCell>
        <TableCell>{row.startDate.toString()}</TableCell>
        <TableCell>{row.endDate.toString()}</TableCell>
        {/* <TableCell><Switch checked={isPromo} onChange={(e) => { setIsPromo(e.target.checked)}} /></TableCell> */}

        {/* <TableCell>
          <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                  label="Amount"
                  value={productPromo}
                  onChange={(e) => setProductPromo(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) )}
              />
          </FormControl>
        </TableCell>
        <TableCell><DatePicker onChange={(newDate) => setStartDate(newDate)} label="Start date" value={startDate} /></TableCell>
        <TableCell><DatePicker onChange={(newDate) => setEndDate(newDate)} label="End date" value={endDate} /></TableCell>
        <TableCell><Button onClick={() => handleUpdatePromo(row.productId, isPromo, productPromo, startDate, endDate)}>Update</Button></TableCell> */}

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
