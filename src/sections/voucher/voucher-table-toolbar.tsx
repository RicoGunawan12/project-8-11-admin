import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { useToaster } from 'src/components/toast/Toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

type VoucherTableToolbarProps = {
  itemsSelected: string[];
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
};

export function VoucherTableToolbar({ itemsSelected, numSelected, filterName, onFilterName, onUpdate }: VoucherTableToolbarProps) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleDeleteVouchers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_VOUCHER}/delete/multiple`, {
        voucherCode: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully delete voucher(s)");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search category"
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <Button
          onClick={handleDeleteVouchers}
          variant="contained"
          color={"error"}
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
        >
          Delete Voucher(s)
        </Button>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
