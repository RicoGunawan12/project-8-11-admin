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

// ----------------------------------------------------------------------

export function AboutView() {
  const nav = useNavigate();
  const [value, setValue] = useState(0);
  const [response, setResponse] = useState<any>();
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [update, setUpdate] = useState(false);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages/about`);
        console.log(response.data.response);
        if (value === 0) {
          setContent(response.data.response[0].contentEng);
          setTitle(response.data.response[0].titleEng);
        }
        else {
          setContent(response.data.response[0].contentIndo);
          setTitle(response.data.response[0].titleIndo);
        }
        setResponse(response.data.response[0])
        setId(response.data.response[0].pageId);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getContent();
  }, [update]);
  
  
  const handleUpdateEngPage = async () => {
    try {
      const body = {
        contentEng: content,
        titleEng: title
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/eng/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
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
  }

  const handleUpdateIndoPage = async () => {
    try {
      const body = {
        contentIndo: content,
        titleIndo: title
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/about/indo/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
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
  }

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
          Main Page
        </Typography>

        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setContent(newValue === 0 ? response.contentEng : response.contentIndo)
            setTitle(newValue === 0 ? response.titleEng : response.titleIndo)
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

            </div>

            <div style={{ width: '50%' }}>
              <img src={`/public/assets/pages/AboutUs1.png`}/>
            </div>
          </div>

          
          
        </div>
      </div>

      <div className="responsive-container">
          <div className="button-container">
          <Button variant="contained" onClick={value === 0 ? handleUpdateEngPage : handleUpdateIndoPage}>
              Update Page
          </Button>
          </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
