import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { BottomNavigation, BottomNavigationAction, Chip } from '@mui/material';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SvgColor } from 'src/components/svg-color';
import ProductComponent from '../product-component';

// ----------------------------------------------------------------------


interface TransactionProps {
  transactionId: string
  readableId: string
  userId: string
  addressId: string
  voucherId: string
  transactionDate: Date
  paymentMethod: string
  gatewayResponse: string
  status: string
  expedition: string
  shippingType: string
  deliveryFee: number
  deliveryCashback: number
  paymentDeadline: Date
  totalPrice: number
  totalWeight: number
  notes: string
  komshipOrderNumber: string
  komshipOrderId: string
  ref_user_id: string
  ref_voucher_id: string
  transaction_details: {
    transactionDetailId: string
    transactionId: string
    productVariantId: string
    quantity: number
    paidProductPrice: number
    realizedPromo: number
    ref_transaction_id: string
    ref_product_variant_id: string
    product_variant: {
      productVariantId: string
      productId: string
      productColor: string
      productSize: string
      sku: string
      productImage: string
      productPrice: number
      productWeight: number
      productWidth: number
      productLength: number
      productHeight: number
      productStock: number
      productPromo: number
      productPromoExpiry: Date
      ref_product_id: string
      product: {
        productId: string
        productCategoryId: string
        productName: string
        productDescription: string
        defaultImage: string
        ref_product_category_id: string;
        isPromo: boolean;
        productPromo: number;
        startDate: Date;
        endDate: Date;
      }
    }
  }[],
  user: {
    userId: string
    username: string
    email: string
    user_addresses: {
      addressId: string
      userId: string
      receiverName: string
      receiverPhoneNumber: string
      komshipAddressId: string
      komshipLabel: string
      addressProvince: string
      addressCity: string
      addressSubdistrict: string
      postalCode: string
      addressDetail: string
      ref_user_id: string
    }[]
  }
}

const statusMap = [
  '',
  'Waiting for shipping',
  'Shipping',
  'Success'
]

type Status = 'Unpaid' | 'Waiting for shipping' | 'Shipping' | 'Done' | 'Cancelled';

const statusColors: Record<Status, 'default' | 'warning' | 'primary' | 'success' | 'error'> = {
  Unpaid: 'default', // Gray
  'Waiting for shipping': 'warning', // Yellow
  Shipping: 'primary', // Blue
  Done: 'success', // Green
  Cancelled: 'error', // Red
};

export function TransactionView() {
  const nav = useNavigate();
  const table = useTable();
  const [value, setValue] = useState(0);
  const [update, setUpdate] = useState(false);
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/transactions?status=${statusMap[value]}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        setTransactions(response.data.transactions);
        console.log(response.data);
      } catch (error) {
        
        if (error.status === 401) {
          nav('/');        
        }
        showErrorToast(error.message);
      }
    }
    getTransactions();
  }, [value]);

  const handleRequestPickUp = async (transactionId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/transactions/pickup`, {
        transactionId
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast("Pick up requested!");
      setUpdate(!update)
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.message);
    }
  }

  const getStatusColor = (status: string): 'default' | 'warning' | 'primary' | 'success' | 'error' => {
    if (status in statusColors) {
      // console.log(statusColors[status as Status]);
      
      return statusColors[status as Status]; // Narrow the type here
    }
    return 'default'; // Return undefined for invalid statuses
  };

  const handlePrintLabel = async (transactionId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/transactions/print/label`, {
        transactionId
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      // showSuccessToast("Pick up requested!");
      setUpdate(!update)
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.message);
    }
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Transactions
        </Typography>
      </Box>

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue);
          
          setValue(newValue);
        }}
        sx={{
          '& .MuiBottomNavigationAction-label': {
            fontSize: '16px',  // Change the font size here
          },
        }}
        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <BottomNavigationAction label="All" />
        <BottomNavigationAction label="Pending" />
        <BottomNavigationAction label="Shipping" />
        <BottomNavigationAction label="Success" />
      </BottomNavigation>
      
      <div style={{ marginTop: '40px' }}>
        {
          transactions.length === 0 ? 
            <div style={{ textAlign: 'center' }}>There is no data</div>
          :
          transactions.map((transaction: TransactionProps) => {
            return <Box key={transaction.transactionId} overflow={'auto'} bgcolor={'white'} min-height={'400px'} borderRadius={'10px'} padding={'20px 40px'} marginBottom={'40px'} boxShadow={'0 4px 8px rgba(0, 0, 0, 0.1)'}>
              <div style={{minWidth: '1000px'}}>
                <div style={{ display:'flex', alignItems:'center', gap: '20px', borderBottom: 'solid 0.2px gray', paddingBottom: '10px'}}>
                  <div>
                    <Chip label={ transaction.status } size='small' color={getStatusColor(transaction.status)}/>
                  </div>
                  <div>/</div>
                  <div>{ transaction.readableId }</div>
                  <div>/</div>
                  <div style={{ display:'flex', alignItems: 'center'}}>
                    <SvgColor width="20px" height="20px" src={`/assets/icons/navbar/ic-user.svg`} />
                    { transaction.user.username}
                  </div>
                  <div>/</div>
                  <div>{ new Date(transaction.transactionDate).toLocaleDateString() }</div>
                </div>
                
                <div style={{ display:'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <div>
                    {
                      transaction.transaction_details.map((detail) => {
                        console.log(detail.product_variant);
                        
                        return <div key={detail.transactionDetailId}>
                          <ProductComponent 
                            productImage={detail.product_variant.productImage} 
                            productName={
                              `
                              ${detail.product_variant.product.productName} -
                              ${detail.product_variant.productColor} -
                              ${detail.product_variant.productSize}
                              `
                            }
                            quantity={detail.quantity} 
                            productPrice={detail.product_variant.productPrice}
                          />
                        </div>
                      })
                    }
                  </div>
                  
                  <div style={{ width: '200px' }}>
                    <div style={{ fontWeight: 'bold' }}>Alamat</div>
                    <div style={{ fontSize: '14px'}}>{transaction.user.user_addresses[0].addressProvince}</div>
                    <div style={{ fontSize: '14px'}}>{transaction.user.user_addresses[0].addressCity}</div>
                    <div style={{
                        fontSize: '14px',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        WebkitLineClamp: 5,
                        textOverflow: 'ellipsis',
                      }}>{transaction.user.user_addresses[0].addressDetail} sadadjasldjasjdlsads adadjasldjasjdlsadsad adjasldjasjdlsadsadadjasldjasj dlsadsadadjasldjasjdlsadsadadjasldjasjdlsadsadadjasldjasjdlsadsadadj asldjasjdlsadsada djasldjas jdlsad</div>
                  </div>
      
                  <div style={{ marginRight: '150px'}}>
                    <div style={{ fontWeight: 'bold' }}>Kurir</div>
                    <div style={{ fontSize: '14px'}}>{transaction.expedition} - {transaction.shippingType}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold'}}>Delivery fee: Rp {transaction.deliveryFee}</div>
                  </div>
                </div>
      
                <div style={{ display:'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                  <div style={{ fontWeight: 'bold' }}>Total Price:</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Rp {transaction.totalPrice}</div>
                </div>
      
                <div style={{ display:'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                  {
                    transaction.status === "Waiting for shipping" ?                  
                    <Button variant='contained' onClick={() => handleRequestPickUp(transaction.transactionId)}>Request Pickup</Button>
                    :
                    transaction.status === "Shipping" ?
                    <Button variant='contained' onClick={() => handlePrintLabel(transaction.transactionId)}>Print Label</Button>
                    :
                    ""
                  }
                </div>
              </div>

            </Box>
          })
        }
      </div>
      
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
