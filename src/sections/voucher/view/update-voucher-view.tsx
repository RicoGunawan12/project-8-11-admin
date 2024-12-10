import { useState, useEffect } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useToaster } from 'src/components/toast/Toast';
import { VoucherProps } from '../utils';

const formatDateToInput = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      // Try parsing the date string
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date received:', dateString);
        return '';
      }
      
      // Format to YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

function UpdateVoucherView() {
  const { id } = useParams<{ id: string }>();
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherType, setVoucherType] = useState<string>('percentage');
  const [voucherStartDate, setVoucherStartDate] = useState<string>('');
  const [voucherEndDate, setVoucherEndDate] = useState<string>('');
  const [maxDiscount, setMaxDiscount] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const nav = useNavigate();
  const { showErrorToast, showSuccessToast } = useToaster();

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/vouchers/getByCode`,
          {
            params: {
              code: id,
            },
          }
        );
  
        const voucher: VoucherProps = response.data;
        console.log(voucher);
  
        // Update state values after fetching voucher details
        setVoucherCode(voucher.voucherCode || '');
        setVoucherType(voucher.voucherType || 'percentage');
        setVoucherStartDate(formatDateToInput(voucher.voucherStartDate));
        setVoucherEndDate(formatDateToInput(voucher.voucherEndDate));
        setMaxDiscount(voucher.maxDiscount.toString());
        setDiscount(voucher.discount.toString());
      } catch (error: any) {
        console.error(error);
        if (error.response?.status === 401) {
          nav('/');
        }
        showErrorToast(error.response?.data?.message || 'Something went wrong.');
      }
    };
  
    fetchVoucher();
  }, [id, nav]);  

  const handleUpdateVoucher = async () => {
    try {
      const updatedVoucherData = {
        vouchers : [{
            voucherCode,
            voucherType,
            voucherStartDate,
            voucherEndDate,
            maxDiscount,
            discount,
        }]
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/vouchers/`,
        updatedVoucherData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      showSuccessToast(response.data.message);
      nav('/voucher');
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        nav('/');
      }
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
      }}
    >
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
        Update Voucher
      </Typography>

      {/* Voucher Type */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher Type"
          variant="outlined"
          fullWidth
          value={voucherType}
          onChange={(e) => setVoucherType(e.target.value)}
          select
          disabled
          SelectProps={{
            native: true,
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </TextField>
      </div>

      {/* Voucher Code */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher Code"
          variant="outlined"
          fullWidth
          value={voucherCode}
          disabled
          onChange={(e) => setVoucherCode(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
      </div>

      {/* Voucher Start Date */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher Start Date"
          variant="outlined"
          type="date"
          fullWidth
          value={voucherStartDate}
          onChange={(e) => setVoucherStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
      </div>

      {/* Voucher End Date */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher End Date"
          variant="outlined"
          type="date"
          fullWidth
          value={voucherEndDate}
          onChange={(e) => setVoucherEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
      </div>

      {/* Max Discount */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Max Discount"
          variant="outlined"
          fullWidth
          type="number"
          value={maxDiscount}
          onChange={(e) => setMaxDiscount(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
      </div>

      {/* Discount */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Discount"
          variant="outlined"
          fullWidth
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: '8px',
            },
            '& .MuiInputLabel-root': {
              color: '#333',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#007BFF',
              },
            },
          }}
        />
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateVoucher}
          disabled={
            !voucherCode || !voucherStartDate || !voucherEndDate || !maxDiscount || !discount
          }
          sx={{
            backgroundColor: '#007BFF',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Update Voucher
        </Button>
      </div>
    </div>
  );
}

export default UpdateVoucherView;
