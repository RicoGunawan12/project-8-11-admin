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

import { BottomNavigation, BottomNavigationAction, Chip, CircularProgress, TextareaAutosize, TextField } from '@mui/material';
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
  const [faqPage, setFAQPage] = useState<File | null>(null);
  const [profilePage, setProfilePage] = useState<File | null>(null);
  const [blogPage, setBlogPage] = useState<File | null>(null);

  const [productPageMobile, setProductPageMobile] = useState<File | null>(null);
  const [aboutPageMobile, setAboutPageMobile] = useState<File | null>(null);
  const [contactPageMobile, setContactPageMobile] = useState<File | null>(null);
  const [faqPageMobile, setFAQPageMobile] = useState<File | null>(null);
  const [profilePageMobile, setProfilePageMobile] = useState<File | null>(null);
  const [blogPageMobile, setBlogPageMobile] = useState<File | null>(null);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
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
                else if (banner.page === "Blog Page") {
                  setBlogPage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "FAQ Page") {
                  setFAQPage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Profile Page") {
                  setProfilePage(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "About Page Mobile") {
                  setAboutPageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Product Page Mobile") {
                  setProductPageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Contact Page Mobile") {
                  setContactPageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Blog Page Mobile") {
                  setBlogPageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "FAQ Page Mobile") {
                  setFAQPageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
                }
                else if (banner.page === "Profile Page Mobile") {
                  setProfilePageMobile(await convertToFile(`${import.meta.env.VITE_BACKEND_API}${banner.image}`))
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
      setLoading(true);
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
        else if (page === "Profile Page") {
          if (profilePage) {
            formData.append("image", profilePage)
          }
        }
        else if (page === "FAQ Page") {
          if (faqPage) {
            formData.append("image", faqPage)
          }
        }
        else if (page === "Blog Page") {
          if (blogPage) {
            formData.append("image", blogPage)
          }
        }
        else if (page === "About Page Mobile") {
          if (aboutPageMobile) {
            formData.append("image", aboutPageMobile)
          }
        }
        else if (page === "Product Page Mobile") {
          if (productPageMobile) {
            formData.append("image", productPageMobile)
          }
        }
        else if (page === "Contact Page Mobile") {
          if (contactPageMobile) {
            formData.append("image", contactPageMobile)
          }
        }
        else if (page === "Profile Page Mobile") {
          if (profilePageMobile) {
            formData.append("image", profilePageMobile)
          }
        }
        else if (page === "FAQ Page Mobile") {
          if (faqPageMobile) {
            formData.append("image", faqPageMobile)
          }
        }
        else if (page === "Blog Page Mobile") {
          if (blogPageMobile) {
            formData.append("image", blogPageMobile)
          }
        }
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/banners`, formData, {
          headers: { 
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get('tys-token')}`
            },
        });
        showSuccessToast("Banner Updated!");
        
      } catch (error) {
        if (error.status === 401) {
          nav("/")
        }
        showErrorToast(error.response.data.message);
      }
      setLoading(false);
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
          Product Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="1000px" 
                height="500px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setProductPage(file)
                }}
                initialFile={productPage}
                name="Product Page Banner"
              />
            </div>

            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    2 : 1 resolution
                </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Product Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>


        <div style={{ width: '100%', marginTop: '20px' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="400px" 
                height="300px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setProductPageMobile(file)
                }}
                initialFile={productPageMobile}
                name="Product Page Banner"
              />
            </div>

            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    4 : 3 resolution
                </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Product Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          About Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="1000px" 
                height="500px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setAboutPage(file)
                }}
                initialFile={aboutPage}
                name="About Page Banner"
              />
            </div>

            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    2 : 1 resolution
                </Typography>
            </div>

          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("About Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>


        <div style={{ width: '100%', marginTop: '20px' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="400px" 
                height="300px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setAboutPageMobile(file)
                }}
                initialFile={aboutPageMobile}
                name="About Page Banner"
              />
            </div>

            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    4 : 3 resolution
                </Typography>
            </div>

          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("About Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          Contact Page
        </Typography>

        <div style={{ width: '100%' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="1000px" 
                height="500px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setContactPage(file)
                }}
                initialFile={contactPage}
                name="Contact Page Banner"
              />
            </div>
            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    2 : 1 resolution
                </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Contact Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>


        <div style={{ width: '100%', marginTop: '20px' }}>        
          <div>
            <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ImageInput 
                width="400px" 
                height="300px" 
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files?.[0] || null;
                  setContactPageMobile(file)
                }}
                initialFile={contactPageMobile}
                name="Contact Page Banner"
              />
            </div>
            <div>
                <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                    4 : 3 resolution
                </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Contact Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          FAQ Page
        </Typography>

        <div style={{ width: '100%' }}>     
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>   
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="1000px" 
              height="500px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setFAQPage(file)
              }}
              initialFile={faqPage}
              name="FAQ Page Banner"
            />
          </div>

          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  2 : 1 resolution
              </Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("FAQ Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: '20px' }}>     
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>   
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="400px" 
              height="300px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setFAQPageMobile(file)
              }}
              initialFile={faqPageMobile}
              name="FAQ Page Banner"
            />
          </div>

          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  4 : 3 resolution
              </Typography>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("FAQ Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          Profile Page
        </Typography>

        <div style={{ width: '100%' }}>    
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>    
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="1000px" 
              height="500px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setProfilePage(file)
              }}
              initialFile={profilePage}
              name="Profile Page Banner"
            />
          </div>
          
          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  2 : 1 resolution
              </Typography>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Profile Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>


        <div style={{ width: '100%', marginTop: '20px' }}>    
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>    
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="400px" 
              height="300px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setProfilePageMobile(file)
              }}
              initialFile={profilePageMobile}
              name="Profile Page Banner"
            />
          </div>
          
          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  4 : 3 resolution
              </Typography>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Profile Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ margin: '20px 0'}}>
        <Typography variant="h6" style={{ margin: '20px 0'}} flexGrow={1}>
          Blog Page
        </Typography>

        <div style={{ width: '100%' }}>    
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Desktop View</div>    
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="1000px" 
              height="500px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setBlogPage(file)
              }}
              initialFile={blogPage}
              name="Blog Banner"
            />
          </div>
          
          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  2 : 1 resolution
              </Typography>
          </div>
            
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Blog Page")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: '20px' }}>    
          <div style={{ textAlign: 'center', marginBottom: '10px'}}>Mobile View</div>    
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageInput 
              width="400px" 
              height="300px" 
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0] || null;
                setBlogPageMobile(file)
              }}
              initialFile={blogPageMobile}
              name="Blog Banner"
            />
          </div>
          
          <div>
              <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                  4 : 3 resolution
              </Typography>
          </div>
            
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" disabled={loading} style={{ margin: '20px 0', width: '120px'}} onClick={() => handleUpdate("Blog Page Mobile")}>
                {loading ? <CircularProgress size={24} /> : "Update Page"}
            </Button>
          </div>
        </div>
      </div>


      
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
