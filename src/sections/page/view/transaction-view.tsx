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

// ----------------------------------------------------------------------

export function PageView() {
  const nav = useNavigate();
  const [value, setValue] = useState(0);
  // const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [id, setId] = useState("");
  const [response, setResponse] = useState<any>();
  const [update, setUpdate] = useState(false);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages`);
        setResponse(response.data.pages[0]);
        if (value === 0) {
          setContent(response.data.pages[0].contentJSONEng);
        }
        else {
          setContent(response.data.pages[0].contentJSONIndo);

        }
        setId(response.data.pages[0].pageId);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getContent();
  }, [update]);
  
  const handleContentChange = (index: number, field: string, value: string) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[index] = {
        ...updatedContent[index],
        [field]: value,
      };
      return updatedContent;
    });
  };
  
  const handleUpdateEngPage = async () => {
    try {
      const body = {
        contentJSONEng: content
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/eng/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      
      showSuccessToast("Pages updated!");
      setUpdate(!update);
      
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
        contentJSONIndo: content
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/indo/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      
      showSuccessToast("Pages updated!");
      setUpdate(!update);
      
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
            setContent(newValue === 0 ? response.contentJSONEng : response.contentJSONIndo)
            console.log(newValue);
            
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
          {
            content.map((con, index) => {
              console.log(con.page);
              
              if (con.page === "About Us Page") return ""
              return <div key={index}>
                <div style={{ margin: '10px 0', fontWeight: 'bold'}}>Section {index + 1}</div>
                
                <div style={{ marginBottom: '50px', display: 'flex', gap:'20px', alignItems: 'center'}}>
                  <div style={{ width: '50%' }}>
                    <div>
                      <TextField fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "title", e.target.value)} value={content[index].title} label={"Title"} variant="outlined" />
                    </div>
                    <TextareaAutosize
                        style={{ borderRadius: '10px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                        aria-label="minimum height"  
                        minRows={3}  
                        value={content[index].content}
                        placeholder="Description"
                        onChange={(e) => handleContentChange(index, "content", e.target.value)}
                    />
                  </div>

                  <div style={{ width: '50%' }}>
                    <img src={`/public/assets/pages/MainPage${index + 1}.png`}/>
                  </div>
                </div>
              </div>
            })
          }
          
        </div>
      </div>
      
      <div className="responsive-container">
          <div className="button-container">
          <Button variant="contained" onClick={value === 1 ? handleUpdateIndoPage : handleUpdateEngPage}>
              Update Page 
          </Button>
          </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
