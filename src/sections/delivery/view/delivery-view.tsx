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
  const [provinces, setProvinces] = useState<{province_id: string, label: string}[]>([]);
  const [cities, setCities] = useState<{city_id: string, province_id: string, province: string, type: string, label: string, postal_code: string}[]>([]);
  const [subdistricts, setSubdistricts] = useState<{subdistrict_id: string, label: string, city_id: string, province_id: string, province: string, type: string, city: string, postal_code: string}[]>([]);
  const [province, setProvince] = useState<string | undefined>("");
  const [city, setCity] = useState<string | undefined>("");
  const [subdistrict, setSubdistrict] = useState<string | undefined>("");
  const [currProvince, setCurrProvince] = useState<string | undefined>("");
  const [currCity, setCurrCity] = useState<string | undefined>("");
  const [currSubdistrict, setCurrSubdistrict] = useState<string | undefined>("");
  const [postalCode, setPostalCode] = useState<string | undefined>("");
  const [detail, setDetail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { showErrorToast, showSuccessToast } = useToaster();
  const [loading, setLoading] = useState(false);

  const [provinceId, setProvinceId] = useState("");

  useEffect(() => {
    async function getProvinces() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/province`);
        console.log(response.data.provinces);
        const transformedProvinces = response.data.provinces.map(({ province_id, province }: { province_id: string, province: string}) => ({
          province_id,
          label: province
      }));
        setProvinces(transformedProvinces);
      } catch (error) {
        showErrorToast(error.message);
      }
    }

    async function currentPickupPoint() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/admin`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        });
        console.log(response.data);
        
        if (response.data.response[0]) {
          setSenderName(response.data.response[0].senderName);
          setPhoneNumber(response.data.response[0].senderPhoneNumber);
          setDetail(response.data.response[0].addressDetail);
          
          setProvince(response.data.response[0].addressProvince);
          setCity(response.data.response[0].addressCity);
          setSubdistrict(response.data.response[0].addressSubdistrict);

          setCurrProvince(response.data.response[0].addressProvince);
          setCurrCity(response.data.response[0].addressCity);
          setCurrSubdistrict(response.data.response[0].addressSubdistrict);

        }
      } catch (error) {
        if (error.status === 401) {
          nav('/')
        }
      }
    }

    currentPickupPoint();
    getProvinces();
  }, [loading])

  async function getCities(id: string | undefined) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/city?province=${id}`);
      
      const transformedCities = response.data.cities.map(({ city_id, province_id, province, type, city_name, postal_code }: {city_id: string, province_id: string, province: string, type: string, city_name: string, postal_code: string}) => ({
        city_id,
        label: `${type} ${city_name}`
      }));
      setCities(transformedCities);
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  async function handleChangeProvince(id: string | undefined, province: string | undefined) {
    setProvince(province);
    await getCities(id);
  }

  async function handleChangeCity(id: string | undefined, cityName: string | undefined) {
    setCity(cityName);
    await getSubdistricts(id);
  }

  async function getSubdistricts(id: string | undefined) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/addresses/subdistrict?city=${id}`);
      const transformedSubdistrict = response.data.subdistrict.rajaongkir.results.map(({ subdistrict_id, subdistrict_name, city_id, province_id, province, type, city, postal_code }: {subdistrict_id: string, subdistrict_name: string, city_id: string, province_id: string, province: string, type: string, city: string, postal_code: string}) => ({
        city_id,
        province_id,
        province,
        type,
        label: subdistrict_name,
        postal_code
      }));
      setSubdistricts(transformedSubdistrict);
    } catch (error) {
      showErrorToast(error.message);
    }
  }

  async function handleUpdatePickUpPoint() {
    setLoading(true);
    try {
      const body = {
        senderName: senderName,
        senderPhoneNumber: phoneNumber,
        province: province, 
        city: city, 
        subdistrict: subdistrict, 
        postalCode: postalCode, 
        addressDetail: detail
      }

      console.log(body);

      await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/addresses/admin`, body, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
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
        <div>
          <Typography variant="subtitle2" flexGrow={1} style={{ marginBottom: '10px', fontSize: '12px' }}>
            Current pick up province <span style={{ color: 'red' }}>{currProvince?.toUpperCase()}</span>
          </Typography>
          <Autocomplete
            disablePortal
            options={provinces}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Province" />}
            onChange={(e, province) => handleChangeProvince(province?.province_id, province?.label) }
          />
        </div>

        <div>
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
        </div>
      </div>

      

      <div style={{ marginTop: '20px'}}>
        <div style={{ display:'flex', flexWrap: 'wrap', gap: '20px'}}>
          <TextField label="Sender Name" variant="outlined" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          <TextField label="Phone Number" type='number' variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
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


