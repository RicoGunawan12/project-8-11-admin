import { Button, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageInput from "src/components/input/ImageInput";
import { useToaster } from "src/components/toast/Toast";

type InsertProductProps = {
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

function InsertProductView({ changePage, handleUpdate }: InsertProductProps) {
    const nav = useNavigate();
    const [categories, setCategories] = useState<{ productCategoryId: string, productCategoryName: string}[]>([]);
    

    const [defaultImage, setDefaultImage] = useState<File | null>(null);
    const handleFileChange = async (e: any) => {
        setDefaultImage(e.target.files[0]);
    };

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };
    const [variants, setVariants] = useState<VariantProps[]>([
        { sku: "test", variantImage: null, productSize: "", productColor: "", productPrice: 0, productStock: 0, productWeight: 0, productLength: 0, productWidth: 0, productHeight: 0 },
    ]);

    const handleAddVariant = () => {
        setVariants([...variants, { sku: "test", variantImage: null, productSize: "", productColor: "", productPrice: 0, productStock: 0, productWeight: 0, productLength: 0, productWidth: 0, productHeight: 0 }]);
    };

    const handleInputChange = <T extends keyof VariantProps>(index: number, field: T, value: VariantProps[T]) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const { showErrorToast, showSuccessToast } = useToaster();

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };


    useEffect(() => {
        async function getCategories() {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/categories`);
            setCategories(response.data);
            console.log(response.data);
          } catch (error) {
            showErrorToast(error.message);
          }
        }
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


      const handleInsertProduct = async () => {
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("productCategoryName", category);
        formData.append("productDescription", description);
        if (defaultImage) {
            formData.append("defaultImage", defaultImage);
        }

        variants.forEach((variant, index) => {
            if (variant.variantImage) {
                const fileExtension = variant.variantImage.name.split(".").pop(); // Get file extension
                const newFileName = `${productName} - ${variant.productSize} - ${variant.productColor}.${fileExtension}`;
        
                const renamedFile = new File([variant.variantImage], newFileName, {
                    type: variant.variantImage.type,
                });
        
                formData.append("productImage", renamedFile);
            }
            
        });
        formData.append(`productVariants`, JSON.stringify(variants));

        // formData.forEach((value, key) => {
        //     console.log(key, value);
        //   });
          
        try {
              

              const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/products`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${Cookies.get('token')}`
                 },
              });

              showSuccessToast(response.data.message);
              setVariants(
                [{ sku: "test", variantImage: null, productSize: "", productColor: "", productPrice: 0, productStock: 0, productWeight: 0, productLength: 0, productWidth: 0, productHeight: 0 }]
              )
              changePage(1);
              handleUpdate();
        } catch (error) {
            console.log(error);
            
            if (error.status === 401) {
                nav('/');
            }
            showErrorToast(error.response.data.message);
        }
      }

  return (
    <div>
        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }} flexGrow={1}>
            Insert Product
        </Typography>

        <div style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', }}>
            <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Basic Information
            </Typography>

            <div style={{ display: 'flex', justifyContent:'space-evenly', alignItems: 'center', gap: '2vw' }}>
                <div>
                    <ImageInput onChange={handleFileChange} name="Default Image" initialFile={defaultImage} width="250px" height="250px"/>
                </div>


                <div style={{ width:'100%' }}>
                    <TextField
                        fullWidth
                        name="productName"
                        label="Product Name"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setProductName(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    
                    <Select
                        onChange={handleChange}
                        defaultValue=" "
                        fullWidth
                    >
                        <MenuItem value=" ">Product Category</MenuItem>
                        {
                            categories.map((cat: { productCategoryId: string, productCategoryName: string}) => 
                                <MenuItem key={cat.productCategoryId} value={cat.productCategoryName}>{cat.productCategoryName}</MenuItem>
                            )
                        }
                    </Select>

                    <TextareaAutosize 
                        style={{ borderRadius: '10px', border: isFocused ? 'blue solid 1px' : '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                        aria-label="minimum height"  
                        minRows={3}  
                        placeholder="Product Description"
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </div>
            </div>
        </div>


        {
            variants.map((variant, index) => 
                <div key={index} style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '50px'}}>
                    <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                        Variant {index + 1}
                    </Typography>

                    <div style={{ display: 'flex', justifyContent:'space-evenly', alignItems: 'center', gap: '2vw' }}>
                        <div>
                            <ImageInput 
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    const file = target.files?.[0] || null;
                                    handleInputChange(index, "variantImage", file);
                                }}
                                name="Variant Image" 
                                initialFile={variant.variantImage}
                                width="250px" height="250px"
                            />
                        </div>

                        <div style={{ width: '100%'}}>
                            <TextField
                                fullWidth
                                name="size"
                                label="Size"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => handleInputChange(index, "productSize", e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                name="color"
                                label="Color"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => handleInputChange(index, "productColor", e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <div style={{ display: 'flex', gap: '20px'}}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                                        label="Amount"
                                        onChange={(e) => handleInputChange(index, "productPrice", parseInt(e.target.value))}
                                    />
                                </FormControl>

                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">pcs</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Stock"
                                    type="number"
                                    onChange={(e) => handleInputChange(index, "productStock", parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px'}}>
                        <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                            Delivery Information
                        </Typography>
                        
                        <div style={{ display:'flex', gap: '10px'}}>
                            <OutlinedInput
                                fullWidth
                                endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                                style={{ height: '55px'}}
                                placeholder="Weight"
                                type="number"
                                onChange={(e) => handleInputChange(index, "productWeight", parseInt(e.target.value))}
                            />
                            <OutlinedInput
                                fullWidth
                                endAdornment={<InputAdornment position="end">meter</InputAdornment>}
                                style={{ height: '55px'}}
                                placeholder="Length"
                                type="number"
                                onChange={(e) => handleInputChange(index, "productLength", parseInt(e.target.value))}
                            />
                            <OutlinedInput
                                fullWidth
                                endAdornment={<InputAdornment position="end">meter</InputAdornment>}
                                style={{ height: '55px'}}
                                placeholder="Width"
                                type="number"
                                onChange={(e) => handleInputChange(index, "productWidth", parseInt(e.target.value))}
                            />
                            <OutlinedInput
                                fullWidth
                                endAdornment={<InputAdornment position="end">meter</InputAdornment>}
                                style={{ height: '55px'}}
                                placeholder="Height"
                                type="number"
                                onChange={(e) => handleInputChange(index, "productHeight", parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px'}}>
            <Button variant="contained" onClick={handleAddVariant}>+ New Variant</Button>
        </div>

        <div style={{ position: 'fixed', bottom: '0', backgroundColor: 'white', zIndex: '1', width:'77.5%', boxShadow: '0px -2px 6px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px', marginBottom: '20px', paddingRight: '40px'}}>
                <Button variant="contained" onClick={handleInsertProduct}>Insert Product</Button>
            </div>
        </div>

    </div>
  )
}

export default InsertProductView;