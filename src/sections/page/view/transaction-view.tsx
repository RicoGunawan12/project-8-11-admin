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
import ImageInput from 'src/components/input/ImageInput';

// ----------------------------------------------------------------------

export function PageView() {
  const nav = useNavigate();
  const [value, setValue] = useState(0);
  // const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [id, setId] = useState("");
  const [response, setResponse] = useState<any>();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToaster();

  useEffect(() => {
    async function getContent() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/pages`);
        setResponse(response.data.pages[0]);
        console.log(response.data);
        
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
    setLoading(true);

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
      showErrorToast(error.response.data.message);
    }
    setLoading(false);

  }

  const handleUpdateIndoPage = async () => {
    setLoading(true);
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
      showErrorToast(error.response.data.message);
    }
    setLoading(false);

  }

  const handleBackgroundChange = async (index: number) => {
    setLoading(true);
    try {
      const body = new FormData();
      console.log(content);
      
      body.append("index", index.toString());
      if (content[index].background) {
        body.append("background", content[index].background);
      }
      if (content[index].photo) {
        body.append("photo", content[index].photo);
      }
      
      
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/pages/background/${id}`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      console.log(response);
      
      showSuccessToast("Background updated!");
    } catch (error) {
      console.log(error);
      
      if (error.status === 401) {
        nav('/');        
      }
      showErrorToast(error.response.data.message);
    }
    setLoading(false);

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
              return <div key={index}>
                <div style={{ margin: '10px 0', fontWeight: 'bold'}}>Section {index + 1}</div>
                
                {
                  con.background && con.photo ?
                  <div style={{ marginBottom: '50px', gap:'20px', alignItems: 'center'}}>
                    <div>
                      <div style={{ width: '100%', justifyContent: 'center', display:'flex' }}>
                        <img src={`/assets/pages/MainPage${index + 1}.png`}/>
                      </div>
                      <div style={{ margin: '20px 0 30px 0'}}>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '40px', flexWrap: 'wrap'}}>
                          <div style={{ width: '40%'}}>
                            <Typography variant='h5' mb={'10px'}>Background</Typography>
                            <ImageInput onChange={(e: any) => handleContentChange(index, "background", e.target.files[0])} imageString={con.background} name='Background' width='100%' height='250px' />
                          </div>
                          <div style={{ width: '40%'}}>
                            <Typography variant='h5' mb={'10px'}>Right image</Typography>
                            <ImageInput onChange={(e: any) => handleContentChange(index, "photo", e.target.files[0])} imageString={con.photo} name='Right Photo' width='100%' height='250px' />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant="contained" disabled={loading} style={{ marginTop: '20px', width: '300px'}} onClick={() => handleBackgroundChange(index)}>
                            {loading ? <CircularProgress size={24} /> : `Update Section ${ index + 1} Background & Image `}
                          </Button>
                        </div>
                      </div>

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
                  </div>
                  :
                  con.bestNumber1 ?
                  <div style={{ marginBottom: '50px', gap:'20px', alignItems: 'center'}}>
                    <div style={{ width: '100%', justifyContent: 'center', display:'flex' }}>
                      <img src={`/assets/pages/MainPage${index + 1}.png`}/>
                    </div>
                    <div>

                      
                      <Typography variant='h5' mb={'10px'}>Left Image</Typography>
                      {
                        con.photo ?
                        <div style={{ margin: '20px 0 30px 0'}}>
                          <div style={{ width: '250px' }}>
                            <ImageInput onChange={(e: any) => handleContentChange(index, "photo", e.target.files[0])} imageString={con.photo} name='Background' width='100%' height='250px' />
                          </div>
                          <Button variant="contained" style={{ marginTop: '20px', width: '140px' }} disabled={loading} onClick={() => handleBackgroundChange(index)}>
                            {loading ? <CircularProgress size={24} /> : "Update Photo"}
                          </Button>
                        </div>
                        :
                        ""
                      }

                      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px'}}>
                        <div>
                          <TextField style={{ marginBottom: '20px'}} fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestNumber1", e.target.value)} value={content[index].bestNumber1} label={"First Data"} variant="outlined" />
                          <TextField fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestTitle1", e.target.value)} value={content[index].bestTitle1} label={"First Title"} variant="outlined" />
                        </div>
                        <div>
                          <TextField style={{ marginBottom: '20px'}} fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestNumber2", e.target.value)} value={content[index].bestNumber2} label={"First Data"} variant="outlined" />
                          <TextField fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestTitle2", e.target.value)} value={content[index].bestTitle2} label={"First Title"} variant="outlined" />
                        </div>
                        <div>
                          <TextField style={{ marginBottom: '20px'}} fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestNumber3", e.target.value)} value={content[index].bestNumber3} label={"First Data"} variant="outlined" />
                          <TextField fullWidth id="outlined-basic" onChange={(e) => handleContentChange(index, "bestTitle3", e.target.value)} value={content[index].bestTitle3} label={"First Title"} variant="outlined" />
                        </div>
                      </div>

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

                    
                  </div>
                  :
                  <div style={{ marginBottom: '50px', display: 'flex', gap:'20px', alignItems: 'center'}}>
                    <div style={{ width: '50%' }}>
                      {
                        con.background ?
                        <div style={{ margin: '20px 0 30px 0'}}>
                          <ImageInput onChange={(e: any) => handleContentChange(index, "background", e.target.files[0])} imageString={con.background} name='Background' width='100%' height='250px' />
                          
                          <Button variant="contained" style={{ marginTop: '20px'}} onClick={() => handleBackgroundChange(index)}>
                              Update Background 
                          </Button>
                        </div>
                        :
                        ""
                      }

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
                      <img src={`/assets/pages/MainPage${index + 1}.png`}/>
                    </div>
                  </div>
                }
              </div>
            })
          }
          
        </div>
      </div>
      
      <div className="responsive-container">
          <div className="button-container">
          <Button variant="contained" style={{ width: '140px'}} disabled={loading} onClick={value === 1 ? handleUpdateIndoPage : handleUpdateEngPage}>
            {loading ? <CircularProgress size={24} /> : "Update Page"}
          </Button>
          </div>
      </div>
      
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
