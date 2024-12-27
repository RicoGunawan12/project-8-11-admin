import { Autocomplete } from "@mui/material";
import { Button, MenuItem, Select, TextareaAutosize, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function InsertPromoView({ changePage, handleUpdate }: InsertPromoProps) {
    const nav = useNavigate();
    const [promoName, setPromoName] = useState("");
    const [promoAmount, setPromoAmount] = useState(0);
    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();
    const [selectedProducts, setSelectedProducts] = useState<ProductProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
    
    useEffect(() => {
        async function getProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products`);
                setProducts(response.data);
            } catch (error) {
                showErrorToast(error.response.data.message);
            }
        }
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

    const handleInsertPromo = async () => {
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
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/promos`, body, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('tys-token')}`,
                },
            });
            showSuccessToast("New promo added!");
            handleUpdate()
            changePage(1)
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
            Insert Promo
        </Typography>

        <div style={{ padding: '10px 10%'}}>
            <div style={{marginBottom: '30px'}}>
                <TextField id="outlined-basic" label="Promo Name" onChange={(e) => setPromoName(e.target.value) } fullWidth variant="outlined" />
            </div>

            <div style={{marginBottom: '30px'}}>
                <FormControl fullWidth >
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>                                                
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                        label="Amount"
                        onChange={(e) => setPromoAmount(parseInt(e.target.value))}
                    />
                </FormControl>
            </div>

            <div style={{ display: 'flex', gap:'10px', marginBottom: '30px' }}>
                <div style={{ width: '100%' }}><DatePicker label='Start date' onChange={(date) => { if (date) setStartDate(date)}} /></div>
                <div style={{ width: '100%' }}><DatePicker label='End date' onChange={(date) => { if (date) setEndDate(date)}} /></div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={products}
                    disableCloseOnSelect
                    fullWidth
                    getOptionLabel={(option: ProductProps) => option.productName}
                    renderOption={(props: any, option : any, { selected } : any) => {
                        const { key, ...optionProps } = props;
                        return (
                        <li key={key} {...optionProps}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.productName}
                        </li>
                        );
                    }}
                    renderInput={(params: any) => (
                        <TextField {...params} label="Products" placeholder="Products" />
                    )}
                    onChange={(e, data) => { setSelectedProducts(data) }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleInsertPromo} variant='contained'>Insert Promo</Button>
            </div>
        </div>
    </div>
  )
}

export default InsertPromoView;