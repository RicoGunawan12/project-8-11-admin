import { Button, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField, Typography, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ImageInput from "src/components/input/ImageInput";
import { useToaster } from "src/components/toast/Toast";

type InsertProductProps = {
    changePage: (curr: number) => void
};

type VariantProps = {

}

function InsertProductView({ changePage }: InsertProductProps) {
    
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const handleFileChange = async (e: any) => {
        setImage(e.target.files[0]);
    };

    const [categories, setCategories] = useState<{ productCategoryId: string, productCategoryName: string}[]>([]);

    const [variants, setVariants] = useState<VariantProps[]>([
        { size: "", color: "", price: "", image: "" },
    ]);

    const handleAddVariant = () => {
        setVariants([...variants, { size: "", color: "", price: "", image: "" }]);
    };

    // const handleInputChange = (index: number, field: string, value: string) => {
    //     const updatedVariants = [...variants];
    //     updatedVariants[index][field] = value;
    //     setVariants(updatedVariants);
    // };

    const { showErrorToast, showSuccessToast } = useToaster();

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        console.log("asd");
        
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
                    <ImageInput onChange={handleFileChange} name="Default Image" initialFile={image}/>
                </div>


                <div style={{ width:'100%' }}>
                    <TextField
                        fullWidth
                        name="size"
                        label="Size"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    
                    <Select
                        onChange={handleChange}
                        label="Product Category"
                        value={category}
                        defaultValue="t"
                        fullWidth
                    >
                        <MenuItem value="t">Product Category</MenuItem>
                        {
                            categories.map((cat: { productCategoryId: string, productCategoryName: string}) => 
                                <MenuItem value={cat.productCategoryName}>{cat.productCategoryName}</MenuItem>
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
                    />

                </div>
            </div>
        </div>


        {
            variants.map((variant, index) => 
                <div style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '50px'}}>
                    <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                        Variant {index + 1}
                    </Typography>

                    <div style={{ display: 'flex', justifyContent:'space-evenly', alignItems: 'center', gap: '2vw' }}>
                        <div>
                            <ImageInput onChange={handleFileChange} name="Variant Image" initialFile={image}/>
                        </div>

                        <div style={{ width: '100%'}}>
                            <TextField
                                fullWidth
                                name="size"
                                label="Size"
                                InputLabelProps={{ shrink: true }}
                                // onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                name="color"
                                label="Color"
                                InputLabelProps={{ shrink: true }}
                                // onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">Rp</InputAdornment>}
                                    label="Amount"
                                />
                            </FormControl>
                        </div>
                    </div>
                </div>
            )
        }

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
            <Button variant="contained" onClick={handleAddVariant}>+ New Variant</Button>
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <Button variant="contained">Insert Product</Button>
        </div>

    </div>
  )
}

export default InsertProductView;