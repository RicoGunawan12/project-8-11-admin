import { Autocomplete } from "@mui/material";
import { Button, MenuItem, Select, TextareaAutosize, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageInput from "src/components/input/ImageInput";
import { useToaster } from "src/components/toast/Toast";
import { ProductProps } from "../utils";
import { Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type InsertPromoProps = {
    changePage: (curr: number) => void
    handleUpdate: () => void
};

type VariantProps = {
    variantImage: File | null;
    productSize: string;
    productColor: string;
    productPrice: number;
    productStock: number;
    productWeight: number;
    productLength: number;
    productWidth: number;
    productHeight: number;
    sku: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function UpdatePromoView() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [promoName, setPromoName] = useState("");
    const [promoAmount, setPromoAmount] = useState(0);
    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();
    const [promoId, setPromoId] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<ProductProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
    
    useEffect(() => {
        async function getProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products`);
                setProducts(response.data);
                console.log(response.data);
                
            } catch (error) {
                showErrorToast(error.response.data.message);
            }
        }
        async function getPromoById() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/promos/${id}` , {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('tys-token')}`,
                    },
                });
                setPromoName(response.data.promo.promoName)
                setPromoAmount(response.data.promo.promoAmount)
                setStartDate(dayjs(response.data.promo.startDate))
                setEndDate(dayjs(response.data.promo.endDate))
                setPromoId(response.data.promo.promoId)

                const selected = response.data.promo.promo_details.map((p: any) => p.product)
                setSelectedProducts(selected)

                console.log(response.data.promo);
                
                
            } catch (error) {
                if (error.status === 401) {
                    nav('/')
                }
                console.log(error);
                
            }
        }
        getPromoById();
        getProducts();
    }, []);

    const { showErrorToast, showSuccessToast } = useToaster();

    function convertDayjsToDate(dayjsDate: dayjs.Dayjs | undefined) {
        if (!dayjsDate) return new Date();
        if (!dayjsDate.isValid()) {
            return { error: "Invalid date format. Use YYYY-MM-DD" };
        }
        return dayjsDate.format('YYYY-MM-DD');
    }

    const handleUpdatePromo = async () => {
        try {
            const products = selectedProducts.map((p) => ({
                productId: p.productId,
            }));
            const body = {
                promoName,
                promoAmount,
                startDate: convertDayjsToDate(startDate),
                endDate: convertDayjsToDate(endDate),
                products
            }
            console.log(body);
            
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/promos/${promoId}`, body, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('tys-token')}`,
                },
            });
            showSuccessToast("Promo updated!");
            // handleUpdate()
            // changePage(1)
            nav("/promos")
        } catch (error) {
            console.log(error);
            
            if (error.status === 401) {
                nav('/')
            }
            showErrorToast(error.response.data.message);
        }
    } 

  return (
    <div>
        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }} flexGrow={1}>
            Update Promo
        </Typography>

        <div style={{ padding: '10px 10%'}}>
            <div style={{marginBottom: '30px'}}>
                <TextField id="outlined-basic" label="Promo Name" value={promoName} onChange={(e) => setPromoName(e.target.value) } fullWidth variant="outlined" />
            </div>

            <div style={{marginBottom: '30px'}}>
                <FormControl fullWidth >
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>                                                
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                        label="Amount"
                        value={promoAmount}
                        onChange={(e) => setPromoAmount(parseInt(e.target.value))}
                    />
                </FormControl>
            </div>

            <div style={{ display: 'flex', gap:'10px', marginBottom: '30px' }}>
                <div style={{ width: '100%' }}><DatePicker label='Start date' value={dayjs(startDate)} onChange={(date) => { if (date) setStartDate(date)}} /></div>
                <div style={{ width: '100%' }}><DatePicker label='End date' value={dayjs(endDate)} onChange={(date) => { if (date) setEndDate(date)}} /></div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={products}
                    disableCloseOnSelect
                    fullWidth
                    getOptionLabel={(option: ProductProps) => option.productName}
                    renderOption={(props, option, { selected }) => {
                        console.log(option);
                        
                        const isChecked = selectedProducts.some((p) => p.productId === option.productId);
                        return (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={isChecked}
                                />
                                {option.productName}
                            </li>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Products" placeholder="Products" />
                    )}
                    value={selectedProducts}
                    onChange={(e, data) => setSelectedProducts(data)}
                />

            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleUpdatePromo} variant='contained'>Update Promo</Button>
            </div>
        </div>
    </div>
  )
}

export default UpdatePromoView;