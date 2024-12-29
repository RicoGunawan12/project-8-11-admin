import { Button, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText, CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageInput from "src/components/input/ImageInput";
import { useToaster } from "src/components/toast/Toast";
import { DashboardContent } from "src/layouts/dashboard";
import { ProductProps } from "../utils";
import { Iconify } from "src/components/iconify";

type InsertProductProps = {
    changePage: (curr: number) => void
    handleUpdate: () => void
};

type VariantProps = {
    id: number
    productVariantId: string
    productImage: File | null;
    productColor: string;
    productPrice: number;
    productStock: number;
    sku: string;
}

function UpdateProductView() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [product, setProduct] = useState<ProductProps>();
    const [categories, setCategories] = useState<{ productCategoryId: string, productCategoryName: string}[]>([]);
    
    const [productSize, setProductSize] = useState("");
    const [productCode, setProductCode] = useState("");
    const [productWeight, setProductWeight] = useState(0);
    const [productLength, setProductLength] = useState(0);
    const [productWidth, setProductWidth] = useState(0);
    const [productHeight, setProductHeight] = useState(0);
    const [loading, setLoading] = useState(false);

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
        { id: 0, productVariantId: "", sku: "test", productImage: null, productColor: "", productPrice: 0, productStock: 0 },
    ]);

    const handleAddVariant = () => {
        setVariants([...variants, { id: variants.length > 0 ? variants[variants.length - 1].id + 1 : 0, productVariantId: "", sku: "test", productImage: null, productColor: "", productPrice: 0, productStock: 0 }]);
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

        async function getProducts() {
            try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products/${id}`);
              setProduct(response.data);
              console.log(response.data);
              
              setProductName(response.data.productName)
              setCategory(response.data.product_category?.productCategoryName ?? "")
              setDescription(response.data.productDescription)
              setProductSize(response.data.productSize)
              setProductCode(response.data.productCode)
              setProductWeight(response.data.productWeight)
              setProductWidth(response.data.productWidth)
              setProductLength(response.data.productLength)
              setProductHeight(response.data.productHeight)
             const updatedVariants = await Promise.all(
                response.data.product_variants.map(async (variant: any, index: number) => {
                    variant.id = index;
                    variant.productImage = await convertToFile(`${import.meta.env.VITE_BACKEND_API}${variant.productImage}`);
                    return variant;
                })
            );
            setVariants(updatedVariants);
              setDefaultImage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${response.data.defaultImage}`));
              console.log(response.data);
              
            } catch (error) {
              showErrorToast(error.message);
            }
          }
        getProducts();
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


      const handleUpdateProduct = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("productCategoryName", category);
        formData.append("productDescription", description);
        formData.append("productSize", productSize);
        formData.append("productCode", productCode);
        formData.append("productWeight", productWeight.toString());
        formData.append("productLength", productLength.toString());
        formData.append("productWidth", productWidth.toString());
        formData.append("productHeight", productHeight.toString());
        if (defaultImage) {
            formData.append("defaultImage", defaultImage);
        }
        
        variants.forEach((variant, index) => {
            if (variant.productImage) {
                console.log(variant.productImage);
                
                const fileExtension = variant.productImage.name.split(".").pop(); // Get file extension
                const newFileName = `${productName} - ${variant.productColor}`;
                
                const renamedFile = new File([variant.productImage], newFileName, {
                    type: variant.productImage.type,
                });
                console.log(renamedFile);
                
                formData.append("productImage", renamedFile);
            } 
        });
        formData.append(`productVariants`, JSON.stringify(variants));
        console.log(variants);
        
        formData.forEach((value, key) => {
            console.log(key, value);
        });
        
        try {
            
            
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/${product?.productId}`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${Cookies.get('tys-token')}`
                },
            });
            
            showSuccessToast(response.data.message);
            //   setVariants(
                //     [{ sku: "test", productImage: null, productSize: "", productColor: "", productPrice: 0, productStock: 0, productWeight: 0, productLength: 0, productWidth: 0, productHeight: 0 }]
                //   )
                nav('/products');
            } catch (error) {
                console.log(error);
                
                if (error.status === 401) {
                    nav('/');
                }
                showErrorToast(error.response.data.message);
            }
            setLoading(false);
        }
        
        
        async function convertToFile(url: string) {
            // Fetch the image as a Blob
            const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
      
        // Convert the response to a Blob
        const blob = await response.blob();
      
        // Create a new File object from the Blob
        const file = new File([blob], "test", { type: blob.type });
      
        return file;
      }

      const handleDeleteVariant = (idx: number) => {
        setVariants(prevVariants => prevVariants.filter(variant => variant.id !== idx));
      }

  return (
    <DashboardContent>
        <div>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => nav('/products')}
            >
                Back
            </Button>
        </div>
        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }} flexGrow={1}>
            Product Detail
        </Typography>

        <div style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', }}>
            <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Basic Information
            </Typography>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'space-evenly', alignItems: 'center', gap: '2vw' }}>
                <div>
                    <ImageInput onChange={handleFileChange} name="Default Image" initialFile={defaultImage} width="250px" height="250px"/>
                </div>


                <div style={{ width:'100%' }}>
                    <TextField
                        fullWidth
                        name="productName"
                        label="Product Name"
                        InputLabelProps={{ shrink: true }}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    
                    <Select
                        onChange={handleChange}
                        // defaultValue={product?.product_category.productCategoryName}
                        value={category}
                        fullWidth
                    >
                        <MenuItem value=" ">Product Category</MenuItem>
                        {
                            categories.map((cat: { productCategoryId: string, productCategoryName: string}) => 
                                <MenuItem key={cat.productCategoryName} value={cat.productCategoryName}>{cat.productCategoryName}</MenuItem>
                            )
                        }
                    </Select>

                    <TextField
                        fullWidth
                        name="size"
                        label="Size"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setProductSize(e.target.value)}
                        style={{ marginTop: '25px' }}
                        value={productSize}
                    />

                    <TextField
                        fullWidth
                        name="code"
                        label="Product code"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setProductCode(e.target.value)}
                        style={{ marginTop: '25px' }}
                        value={productCode}
                    />

                    <TextareaAutosize 
                        style={{ borderRadius: '10px', border: isFocused ? 'blue solid 1px' : '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                        aria-label="minimum height"  
                        minRows={3}  
                        placeholder="Product Description"
                        value={description}
                        onFocus={handleFocus} 
                        onBlur={handleBlur}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div style={{ marginTop: '30px'}}>
                        <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                            Delivery Information
                        </Typography>
                        
                        <div style={{ display:'flex', gap: '10px'}}>
                            <FormControl sx={{ width: '100ch' }} variant="outlined">
                                <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">gram</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Weight"
                                    type="number"
                                    value={productWeight}
                                    onChange={(e) => setProductWeight(parseInt(e.target.value))}
                                    />
                            </FormControl>

                            <FormControl sx={{ width: '100ch' }} variant="outlined">
                                <FormHelperText id="outlined-weight-helper-text">Length</FormHelperText>
                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">centimeter</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Length"
                                    type="number"
                                    value={productLength}
                                    onChange={(e) => setProductLength(parseInt(e.target.value))}
                                    />
                            </FormControl>

                            <FormControl sx={{ width: '100ch' }} variant="outlined">
                                <FormHelperText id="outlined-weight-helper-text">Width</FormHelperText>
                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">centimeter</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Width"
                                    type="number"
                                    value={productWidth}
                                    onChange={(e) => setProductWidth(parseInt(e.target.value))}
                                    />
                            </FormControl>
                            
                            <FormControl sx={{ width: '100ch' }} variant="outlined">
                                <FormHelperText id="outlined-weight-helper-text">Height</FormHelperText>
                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">centimeter</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Height"
                                    type="number"
                                    value={productHeight}
                                    onChange={(e) => setProductHeight(parseInt(e.target.value))}
                                    />
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {
            variants.map((variant, index) => {
                console.log(variant);
                
                return <div key={variant.productVariantId} style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '50px'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                            Variant {index + 1}
                        </Typography>
                        {
                            variants.length > 1 ?
                            <MenuItem  onClick={() => handleDeleteVariant(variant.id)} sx={{ color: 'error.main' }}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                                Delete
                            </MenuItem>
                            :
                            ""
                        }
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'space-evenly', alignItems: 'center', gap: '2vw' }}>
                        <div>
                            <ImageInput 
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    const file = target.files?.[0] || null;
                                    handleInputChange(index, "productImage", file);
                                }}
                                width="250px" height="250px"
                                name="Variant Image" 
                                initialFile={variant.productImage}
                                // imageString={variant.productImage}
                            />
                        </div>

                        <div style={{ width: '100%'}}>

                            <TextField
                                fullWidth
                                name="color"
                                label="Color"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => handleInputChange(index, "productColor", e.target.value)}
                                sx={{ mb: 3 }}
                                value={variant.productColor}
                            />

                            <div style={{ display: 'flex', gap: '20px'}}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                                        label="Amount"
                                        value={variant.productPrice}
                                        type="number"
                                        onChange={(e) => handleInputChange(index, "productPrice", parseInt(e.target.value))}
                                    />
                                </FormControl>

                                <OutlinedInput
                                    fullWidth
                                    endAdornment={<InputAdornment position="end">pcs</InputAdornment>}
                                    style={{ height: '55px'}}
                                    placeholder="Stock"
                                    type="number"
                                    value={variant.productStock}
                                    onChange={(e) => handleInputChange(index, "productStock", parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            })
        }

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px'}}>
            <Button variant="contained" onClick={handleAddVariant}>+ New Variant</Button>
        </div>

        <div style={{ position: 'fixed', bottom: '0', backgroundColor: 'white', zIndex: '1', width:'77.5%', boxShadow: '0px -2px 6px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px', marginBottom: '20px', paddingRight: '40px'}}>
                <Button disabled={loading} variant="contained" style={{ width: '150px' }} onClick={handleUpdateProduct}>{loading ? <CircularProgress size={24} /> : "Update Product"}</Button>
            </div>
        </div>

    </DashboardContent>
  )
}

export default UpdateProductView;