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

import { BottomNavigation, BottomNavigationAction, Chip, TextareaAutosize, TextField } from '@mui/material';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SvgColor } from 'src/components/svg-color';
import { Editor } from '@tinymce/tinymce-react';
import ImageInput from 'src/components/input/ImageInput';

// ----------------------------------------------------------------------

export function BannerView() {
  const nav = useNavigate();
  const [productPage, setProductPage] = useState<File | null>(null);
  const [aboutPage, setAboutPage] = useState<File | null>(null);
  const [contactPage, setContactPage] = useState<File | null>(null);
  const [update, setUpdate] = useState(false);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getBanners() {
            try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/banners`);
              response.data.banners.map(async (banner: { bannerId: string, image: string, page: string}) => {
                if (banner.page === "About Page") {
                  setAboutPage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Product Page") {
                  setProductPage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Contact Page") {
                  setContactPage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
              })
            } catch (error) {
              showErrorToast(error.message);
            }
          }
        getBanners();
  }, [update]);
  
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

    async function handleUpdate(page: string) {
      try {
        const formData = new FormData();
        formData.append("page", page);
        if (page === "About Page") {
          if (aboutPage) {
            formData.append("image", aboutPage)
          }
        }
        else if (page === "Product Page") {
          if (productPage) {
            formData.append("image", productPage)
          }
        }
        else if (page === "Contact Page") {
          if (contactPage) {
            formData.append("image", contactPage)
          }
        }
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/banners`, formData, {
          headers: { 
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get('token')}`
            },
        });
        showSuccessToast("Banner Updated!");
        
      } catch (error) {
        if (error.status === 401) {
          nav("/")
        }
        showErrorToast(error.response.data.message);
      }
    }

  return (
    <DashboardContent>
      
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" flexGrow={1}>
          Banners
        </Typography>
      </Box>
      <Typography variant="body1" flexGrow={1}>
        This banner will be showed on top of page
      </Typography>


      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          About Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <ImageInput 
              width="100%" 
              height="200px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setAboutPage(file)
              }}
              initialFile={aboutPage}
              name="About Banner"
            />

          </div>
          <Button variant="contained" style={{ margin: '20px 0'}} onClick={() => handleUpdate("About Page")}>
              Update Page
          </Button>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          Contact Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <ImageInput 
              width="100%" 
              height="200px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setContactPage(file)
              }}
              initialFile={contactPage}
              name="Contact Banner"
            />
          </div>
          <Button variant="contained" style={{ margin: '20px 0'}} onClick={() => handleUpdate("Contact Page")}>
              Update Page
          </Button>
        </div>
      </div>


      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          Product Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <ImageInput 
              width="100%" 
              height="200px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setProductPage(file)
              }}
              initialFile={productPage}
              name="Product Banner"
            />
          </div>
          <Button variant="contained" style={{ margin: '20px 0'}} onClick={() => handleUpdate("Product Page")}>
              Update Page
          </Button>
        </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
