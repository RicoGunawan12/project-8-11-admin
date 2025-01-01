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
import WhyImage from '../../../../assets/pages/AboutUs2.png'
import ImageInput from 'src/components/input/ImageInput';

// ----------------------------------------------------------------------

export function AboutView() {
  const nav = useNavigate();
  const [value, setValue] = useState(0);
  const [response, setResponse] = useState<any>();
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [whyResponse, setWhyResponse] = useState<any>();
  const [whyContent, setWhyContent] = useState<any[]>([]);

  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages/about`);
        console.log(response.data.response);
        if (value === 0) {
          setContent(response.data.response[0].contentEng);
          setTitle(response.data.response[0].titleEng);
          setWhy(response.data.response[0].whyEng)
        }
        else {
          setContent(response.data.response[0].contentIndo);
          setTitle(response.data.response[0].titleIndo);
          setWhy(response.data.response[0].whyIndo)
        }
        setResponse(response.data.response[0])
        setId(response.data.response[0].pageId);
      } catch (error) {
        showErrorToast(error.message);
      }
    }

    async function getWhyContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/why`);
        console.log(response.data.response);
        setWhyResponse(response.data.response)
        if (value === 0) {
          setWhyContent(response.data.response[0].whyContentJSONEng);
        }
        else {
          setWhyContent(response.data.response[0].whyContentJSONIndo);
        }
        
      } catch (error) {
        showErrorToast(error.response.data.message); 
      }
    }
    getContent();
    getWhyContent();
  }, [update]);
  
  
  const handleUpdateEngPage = async () => {
    setLoading(true);
    try {
      const body = {
        contentEng: content,
        titleEng: title,
        whyEng: why,
        whyContentJSONEng: whyContent,
        whyContentId: whyResponse[0].whyId
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/eng/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      
      setUpdate(!update)
      showSuccessToast("Pages updated!");
      
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.message);
    }
    setLoading(false);
  }

  const handleUpdateIndoPage = async () => {
    setLoading(true);
    try {
      const body = {
        contentIndo: content,
        titleIndo: title,
        whyIndo: why,
        whyContentJSONIndo: whyContent,
        whyContentId: whyResponse[0].whyId
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/indo/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      setUpdate(!update)
      showSuccessToast("Pages updated!");
      
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.message);
    }
    setLoading(false);
  }

  const handleUpdatePhoto = async (index: number) => {
    setLoading(true);
    try {
      const body = new FormData();
      console.log(content);
      
      body.append("index", index.toString());
      if (whyContent[index].photo) {
        body.append("photo", whyContent[index].photo);
      }
      
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/why/photo`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      console.log(response);
      
      showSuccessToast("Photo updated!");
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.response.data.message);
    }
    setLoading(false);

  }

  const handleContentChange = (index: number, field: string, value: string) => {
    setWhyContent((prevContent: any) => {
      const updatedContent = [...prevContent];
      updatedContent[index] = {
        ...updatedContent[index],
        [field]: value,
      };
      return updatedContent;
    });
  };

  return (
    <DashboardContent>
      <style>
            {`
            .responsive-container {
                position: fixed;
                bottom: 0;
                background-color: white;
                z-index: 1;
                width: calc(100vw - 300px - var(--layout-dashboard-content-px)*2 - 80px); /* Default width */
                box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.2);
            }

            @media (max-width: 1200px) {
                .responsive-container {
                width: calc(100vw - 24px); /* Full width for smaller screens */
                }
            }

            .button-container {
                width: 100%;
                display: flex;
                justify-content: end;
                margin-top: 20px;
                margin-bottom: 20px;
                padding-right: 40px;
            }
            `}
        </style>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Pages
        </Typography>
      </Box>


      <div>
        <Typography variant="h6" flexGrow={1}>
          About Page
        </Typography>

        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setContent(newValue === 0 ? response.contentEng : response.contentIndo)
            setTitle(newValue === 0 ? response.titleEng : response.titleIndo)
            setWhy(newValue === 0 ? response.whyEng : response.whyIndo)
            setWhyContent(newValue === 0 ? whyResponse[0].whyContentJSONEng : whyResponse[0].whyContentJSONIndo)
            setValue(newValue);
          }}
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: '16px',  // Change the font size here
            },
          }}
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', margin: '40px 0', position: 'sticky', top: '20' }}
        >
          <BottomNavigationAction label="English" />
          <BottomNavigationAction label="Indonesia" />
        </BottomNavigation>


        <div>      
          <div style={{ margin: '10px 0 20px', fontWeight: 'bold'}}>Section 1</div>
          <div style={{ marginBottom: '50px', display: 'flex', gap:'20px', alignItems: 'center'}}>
            <div style={{ width: '50%' }}>
              <div>
                <TextField fullWidth id="outlined-basic"  label={"Title"} value={title} onChange={(e) => setTitle(e.target.value)} variant="outlined" />
              </div>
              <div style={{marginTop: '20px'}}>
                <Editor
                  apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: 'lists link image table',
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent',
                  }}
                  onEditorChange={(content) => setContent(content)}
                  value={content}
                />
              </div>

              <div>
                <TextareaAutosize 
                    style={{ borderRadius: '10px', border: '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={3}  
                    placeholder="Why Tyeso?"
                    value={why}
                    onChange={(e) => setWhy(e.target.value)}
                />
              </div>

            </div>

            <div style={{ width: '50%' }}>
              <img src={`/assets/pages/AboutUs1.png`}/>
            </div>
          </div>

          
          
        </div>
      </div>

      <div style={{ marginBottom: '50px'}}>
        
        <div style={{ margin: '10px 0 20px', fontWeight: 'bold'}}>Section 2</div>

        <div>
          <img src={`/assets/pages/AboutUs2.png`}/>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>

          {
            whyContent.map((why: any, index: number) => {
              return <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '270px' }}>
                <div style={{ margin: '10px 0 20px', fontWeight: 'bold'}}>Photo {index + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ImageInput onChange={(e: any) => handleContentChange(index, "photo", e.target.files[0])} imageString={why.photo} name='Photo' width='150px' height='150px'/>
                </div>
                
                <div>
                    <Typography id="modal-modal-title" variant="caption" marginTop={'10px'} textAlign={'center'} component="h2">
                        1 : 1 resolution
                    </Typography>
                </div>

                <div>
                  <Button variant='contained' style={{ marginTop: '10px', width: '130px'}} disabled={loading} onClick={(e) => handleUpdatePhoto(index)}>
                  {loading ? <CircularProgress size={24} /> : "Update Photo"}
                  </Button>
                </div>
                
                <div style={{ width: '100%' }}>
                  <TextareaAutosize 
                      style={{ borderRadius: '10px', border: '#E7E7E7 solid 1px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                      aria-label="minimum height"  
                      minRows={3}  
                      placeholder={`Why content ${index + 1}`}
                      value={why.content}
                      onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                  />
                </div>
    
              </div>
            })
          }

        </div>
      </div>


      <div className="responsive-container">
          <div className="button-container">
          <Button variant="contained" disabled={loading} style={{ width: '140px' }} onClick={value === 0 ? handleUpdateEngPage : handleUpdateIndoPage}>
          {loading ? <CircularProgress size={24} /> : "Update Page"}
          </Button>
          </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
