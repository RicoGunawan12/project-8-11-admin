import { LoadingButton } from '@mui/lab';
import { Button, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/material';
import { Box } from '@mui/material';
import { Autocomplete, Typography } from '@mui/material'
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom'
import { useToaster } from 'src/components/toast/Toast';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard'

export function DeliveryView() {
  const nav = useNavigate();
  const [destinations, setDestinations] = useState<{city_name: string, district_name: string, id: number, label: string, subdistrict_name: string, zip_code: string}[]>([]);
  
  const [destination, setDestination] = useState<string | undefined>("");
  
  const [selectedDestination, setSelectedDestination] = useState<{city_name: string, district_name: string, id: number, label: string, subdistrict_name: string, zip_code: string}>();
  const [postalCode, setPostalCode] = useState<string | undefined>("");
  const [label, setLabel] = useState<string | undefined>("");
  const [detail, setDetail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { showErrorToast, showSuccessToast } = useToaster();
  const [loading, setLoading] = useState(false);

  const [provinceId, setProvinceId] = useState("");

  useEffect(() => {
    async function currentPickupPoint() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/admin`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        });
        console.log(response.data);
        
        if (response.data.response[0]) {
          setSenderName(response.data.response[0].senderName);
          setPhoneNumber(response.data.response[0].senderPhoneNumber);
          setDetail(response.data.response[0].addressDetail);
          setLabel(response.data.response[0].komshipLabel);
        }
      } catch (error) {
        if (error.status === 401) {
          nav('/')
        }
      }
    }

    
    currentPickupPoint();
  }, [loading]);

  useEffect(() => {
    async function getAllDestination() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/destination?keyword=${destination}`);
        setDestinations(response.data.searchResult.data);
        console.log(response.data.searchResult.data);
        
      } catch (error) {
        console.log(error);
        
        showErrorToast(error.message);
      }
    }
    if (destination && destination?.length > 0) {
      getAllDestination();
    }
  }, [destination]);

  async function handleUpdatePickUpPoint() {
    setLoading(true);
    try {
      const body = {
        senderName: senderName,
        senderPhoneNumber: phoneNumber,
        city: selectedDestination?.city_name, 
        subdistrict: selectedDestination?.subdistrict_name, 
        district: selectedDestination?.district_name, 
        postalCode: selectedDestination?.zip_code, 
        addressDetail: detail,
        komshipAddressId: selectedDestination?.id,
        label: selectedDestination?.label
      }

      console.log(body);

      await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/addresses/admin`, body, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      })
      showSuccessToast("Pick up point updated!");
      
    } catch (error) {
      if (error.status === 401) {
        nav('/')
      }
      console.log(error);
      
      showErrorToast(error.response.data.message);
    }
    setLoading(false);
  }

  return (
    <DashboardContent>
      <Helmet>
        <title> {`Delivery - ${CONFIG.appName}`}</title>
      </Helmet>
      <Box mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Delivery Data
        </Typography>

        <Typography variant="subtitle1" flexGrow={1}>
          This delivery data will be the pick up point for expedition
        </Typography>
      </Box>
      <div style={{ display:'flex', flexWrap: 'wrap', gap: '10px'}}>
        <div style={{ width: '100%' }}>
          <Typography variant="subtitle2" flexGrow={1} style={{ marginBottom: '10px', fontSize: '12px' }}>
            Current pick up province <span style={{ color: 'red' }}>{label?.toUpperCase()}</span>
          </Typography>

          <Autocomplete
            fullWidth
            disablePortal
            options={destinations}
            // sx={{ width:  }}
            renderInput={(params) => <TextField {...params} label="Type city / district / subdistrict / postal code" />}
            onInputChange={(event, newInputValue) => {
              setDestination(newInputValue);
            }}
            onChange={(event: any, newValue: any) => {
              setSelectedDestination(newValue);
            }}
          />

        </div>

        {/* <div>
          <Typography variant="subtitle2" flexGrow={1} style={{ marginBottom: '10px', fontSize: '12px' }}>
            Current pick up city <span style={{ color: 'red' }}>{currCity?.toUpperCase()}</span>
          </Typography>
          <Autocomplete
            disablePortal
            disabled={province === "" ? true : false}
            options={cities}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="City" />}
            onChange={(e, city) => handleChangeCity(city?.city_id, city?.label) }
          />
        </div>

        <div>
          <Typography variant="subtitle2" flexGrow={1} style={{ marginBottom: '10px', fontSize: '12px' }}>
            Current pick up subdistrict <span style={{ color: 'red' }}>{currSubdistrict?.toUpperCase()}</span>
          </Typography>
          <Autocomplete
            disablePortal
            disabled={city === "" ? true : false}
            options={subdistricts}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Subdistrict" />}
            onChange={(e, subdistrict) => {
              setSubdistrict(subdistrict?.label)
              setPostalCode(subdistrict?.postal_code)
            }}
          />
        </div> */}
      </div>

      

      <div style={{ marginTop: '20px'}}>
        <div style={{ display:'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          <TextField style={{ width: '45%' }} label="Sender Name" variant="outlined" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          <TextField style={{ width: '45%' }} label="Phone Number" type='number' variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
        </div>

        <TextareaAutosize
            style={{ borderRadius: '10px', width: '100%', marginTop: '25px', padding: '10px', fontFamily: 'inherit', fontSize: '16px'}} 
            aria-label="minimum height"  
            minRows={3}  
            value={detail}
            placeholder="Address Detail"
            onChange={(e) => setDetail(e.target.value)}
        />
        {
          loading ? 
          <LoadingButton
            loading
            loadingPosition="start"
            // startIcon={<SaveIcon />}
            variant="contained"
            style={{ marginTop: '20px' }}
          >
            Update Pick Up Point
          </LoadingButton>
          :
          <Button  style={{ marginTop: '20px' }} onClick={handleUpdatePickUpPoint} variant='contained'>Update Pick Up Point</Button>
        }
      </div>

    </DashboardContent>
  )
}


