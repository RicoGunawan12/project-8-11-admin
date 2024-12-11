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
  const [language, setLanguage] = useState("");
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages`);
        setContent(response.data.pages[0].contentJSON);
        setId(response.data.pages[0].pageId);
        setLanguage(response.data.pages[0].language);
        
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getContent();
  }, [value]);
  
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
  
  const handleUpdatePage = async () => {
    try {
      const body = {
        contentJSON: content,
        language
      }
      console.log(body);
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      
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
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Pages
        </Typography>
      </Box>


      <div>
        <Typography variant="h6" flexGrow={1}>
          Main Page
        </Typography>
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

          <Typography variant="h6" flexGrow={1}>
            About Us Page
          </Typography>
          <div style={{ marginTop: '20px'}}>
            <div style={{ marginBottom: '50px', display: 'flex', gap:'20px', alignItems: 'center'}}>
              <div style={{ width: '50%' }}>
                <div>
                  <TextField fullWidth id="outlined-basic"  label={"Title"} value={content[4]?.title} onChange={(e) => handleContentChange(4, "title", e.target.value)} variant="outlined" />
                </div>
                <TextareaAutosize
                    style={{ borderRadius: '10px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={3}  
                    value={content[4]?.boldContent}
                    placeholder="Description"
                    onChange={(e) => handleContentChange(4, "boldContent", e.target.value)}
                />
                <TextareaAutosize
                    style={{ borderRadius: '10px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
                    aria-label="minimum height"  
                    minRows={3}  
                    value={content[4]?.content}
                    placeholder="Description"
                    onChange={(e) => handleContentChange(4, "content", e.target.value)}
                />
              </div>

              <div style={{ width: '50%' }}>
                <img src={`/public/assets/pages/AboutUs1.png`}/>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <div style={{ position: 'fixed', bottom: '0', backgroundColor: 'white', zIndex: '1', width:'77.5%', boxShadow: '0px -2px 6px rgba(0, 0, 0, 0.2)' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px', marginBottom: '20px', paddingRight: '40px'}}>
              <Button variant="contained" onClick={handleUpdatePage}>Update Product</Button>
          </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
