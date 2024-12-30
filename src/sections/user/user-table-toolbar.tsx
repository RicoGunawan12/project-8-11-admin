import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Button } from '@mui/material';
import { useToaster } from 'src/components/toast/Toast';
import axios from 'axios';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  itemsSelected: string[];
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
};

export function UserTableToolbar({ itemsSelected, numSelected, filterName, onFilterName, onUpdate }: UserTableToolbarProps) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleActivateUsers = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}/activate`, {
        userId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully activate accounts");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleDeactivateUsers = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}/deactivate`, {
        userId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully deactivate accounts");
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
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <div>
          <Button
            onClick={handleActivateUsers}
            variant="contained"
            color={"success"}
            style={{ marginLeft: "1rem", marginRight: "1rem" }}
          >
            Activate All
          </Button>

          <Button
            onClick={handleDeactivateUsers}
            variant="contained"
            color={"error"}
          >
            Deactivate All
          </Button>
        </div>
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
