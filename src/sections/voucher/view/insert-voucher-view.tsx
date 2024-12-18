import { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useToaster } from 'src/components/toast/Toast';

type InsertVoucherProps = {
  changePage: (curr: number) => void;
  handleUpdate: () => void;
};

function InsertVoucherView({ changePage, handleUpdate }: InsertVoucherProps) {
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherType, setVoucherType] = useState<string>('percentage'); // Default type can be percentage
  const [voucherStartDate, setVoucherStartDate] = useState<string>('');
  const [voucherEndDate, setVoucherEndDate] = useState<string>('');
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);

  const nav = useNavigate();
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleInsertVoucher = async () => {
    try {
      const voucherData = {
        vouchers: [{
            voucherCode,
            voucherType,
            voucherStartDate,
            voucherEndDate,
            maxDiscount,
            discount,
            quota
        }]
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/vouchers`,
        voucherData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      showSuccessToast(response.data.message);
      changePage(1);
      handleUpdate(); 
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        nav('/');
      }
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>Insert Voucher</Typography>

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher Type"
          variant="outlined"
          fullWidth
          value={voucherType}
          onChange={(e) => setVoucherType(e.target.value)}
          select
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

      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Voucher Code"
          variant="outlined"
          fullWidth
          value={voucherCode}
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

      <div style={{ marginBottom: '20px' }}>
  <TextField
    label="Max Discount"
    variant="outlined"
    fullWidth
    type="number"
    value={maxDiscount || ''} // Prevents leading zeros by not showing "0"
    onChange={(e) => {
      const value = e.target.value;
      setMaxDiscount(value === '' ? 0 : parseInt(value, 10)); // Sets value to 0 if input is empty
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

<div style={{ marginBottom: '20px' }}>
  <TextField
    label="Discount"
    variant="outlined"
    fullWidth
    type="number"
    value={discount || ''} // Prevents leading zeros by not showing "0"
    onChange={(e) => {
      const value = e.target.value;
      setDiscount(value === '' ? 0 : parseInt(value, 10)); // Sets value to 0 if input is empty
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

<div style={{ marginBottom: '20px' }}>
  <TextField
    label="Quota"
    variant="outlined"
    fullWidth
    type="number"
    value={quota || ''} // Prevents leading zeros by not showing "0"
    onChange={(e) => {
      const value = e.target.value;
      setQuota(value === '' ? 0 : parseInt(value, 10)); // Sets value to 0 if input is empty
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


      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsertVoucher}
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
          Submit Voucher
        </Button>
      </div>
    </div>
  );
}

export default InsertVoucherView;
