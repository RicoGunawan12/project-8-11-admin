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

type ProductTableToolbarProps = {
  itemsSelected: string[];
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
};

export function ProductTableToolbar({ itemsSelected, numSelected, filterName, onFilterName, onUpdate }: ProductTableToolbarProps) {
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleMarkProductsBestSeller = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}/bestseller/active`, {
        productId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully mark product(s) as best seller");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleMarkProductsActive = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}/activitystatus/active`, {
        productId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully mark product(s) as best seller");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleUnmarkProductsBestSeller = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}/bestseller/inactive`, {
        productId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully unmark product(s) as best seller");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleMarkProductsInactive = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}/activitystatus/inactive`, {
        productId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully unmark product(s) as best seller");
      onUpdate();
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  const handleDeleteProducts = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_PRODUCT}/delete/multiple`, {
        productId: itemsSelected
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Successfully delete product(s)");
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
          placeholder="Search product"
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                onClick={handleMarkProductsBestSeller}
                variant="contained"
                color={"success"}
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "0.25rem", marginBottom: "0.25rem" }}
              >
                Mark Best Seller
              </Button>
              <Button
                onClick={handleMarkProductsActive}
                variant="contained"
                color={"success"}
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "0.25rem", marginBottom: "0.25rem" }}
              >
                Mark as Active
              </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                onClick={handleUnmarkProductsBestSeller}
                variant="contained"
                color={"error"}
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "0.25rem", marginBottom: "0.25rem" }}
              >
                Unmark Best Seller
              </Button>
              <Button
                onClick={handleMarkProductsInactive}
                variant="contained"
                color={"error"}
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem", marginTop: "0.25rem", marginBottom: "0.25rem" }}
              >
                Mark as Inactive
              </Button>
            </div>
          </div>
          <Button
            onClick={handleDeleteProducts}
            variant="contained"
            color={"error"}
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            Delete Product(s)
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
