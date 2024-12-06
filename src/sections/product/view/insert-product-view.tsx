import { Button, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToaster } from "src/components/toast/Toast";

type InsertProductProps = {
    changePage: (curr: number) => void
};


function InsertProductView({ changePage }: InsertProductProps) {
    
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const [categories, setCategories] = useState<{ productCategoryId: string, productCategoryName: string}[]>([]);
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

            <div>
                <div>

                </div>

                <div>
                    <TextField
                        fullWidth
                        name="email"
                        label="Product Name"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Select
                        onChange={handleChange}
                        label="Product Category"
                        value={category}
                        fullWidth
                    >
                        {
                            categories.map((cat: { productCategoryId: string, productCategoryName: string}) => 
                                <MenuItem value={cat.productCategoryName}>{cat.productCategoryName}</MenuItem>
                            )
                        }
                    </Select>
                </div>

                <TextareaAutosize 
                    style={{ borderRadius: '10px', border: isFocused ? 'blue solid 1px' : '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={5}  
                    placeholder="Product Description"
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                />
            </div>
        </div>


        <div style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginTop: '50px'}}>
            <Typography style={{ marginBottom: '20px', fontWeight: 'bold' }}>
                Variant
            </Typography>

            <div>
                <div>

                </div>

                <div>
                    <TextField
                        fullWidth
                        name="email"
                        label="Product Name"
                        InputLabelProps={{ shrink: true }}
                        // onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Select
                        onChange={handleChange}
                        label="Product Category"
                        value={category}
                        fullWidth
                    >
                        {
                            categories.map((cat: { productCategoryId: string, productCategoryName: string}) => 
                                <MenuItem value={cat.productCategoryName}>{cat.productCategoryName}</MenuItem>
                            )
                        }
                    </Select>
                </div>

                <TextareaAutosize 
                    style={{ borderRadius: '10px', border: isFocused ? 'blue solid 1px' : '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={5}  
                    placeholder="Product Description"
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                />
            </div>
        </div>
    </div>
  )
}

export default InsertProductView;