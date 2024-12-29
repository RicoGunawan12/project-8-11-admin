import { SelectChangeEvent } from "@mui/material";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToaster } from "src/components/toast/Toast";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { UserPageNumbers, UserPageProps } from "../utils";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function InsertUserView({ currPage, changePage, updateSignal, handleUpdate }: UserPageProps) {
    const nav = useNavigate();
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const { showErrorToast, showSuccessToast } = useToaster();

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const roles: {
        value: string;
        label: string;
    }[] = [
        { value: "user", label: "USER" },
        { value: "admin", label: "ADMIN" }
    ];

    const handleInsertUser = async () => {
        try {
            const body = {
                fullName,
                email,
                phone,
                role,
                password,
                confirmPassword
            };
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_API_ENDPOINT_USER}`, body, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('tys-token')}`,
                },
            });
            showSuccessToast("New user added!");
            handleUpdate();
            changePage(UserPageNumbers.SHOW_PAGE_VIEW);
        } catch (error) {
            if (error.status === 401) {
                nav('/')
            }
            showErrorToast(error.response.data.message);
        }
    } 

  return (
    <div>
        <Button
            variant="contained"
            color="inherit"
            onClick={() => changePage(UserPageNumbers.SHOW_PAGE_VIEW)}
        >
            Back
        </Button>

      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px' }} flexGrow={1}>
        Insert User
      </Typography>

      <div style={{ padding: '10px 10%' }}>

        <div style={{ marginBottom: '30px' }}>
            <Select onChange={handleRoleChange} defaultValue=" " fullWidth>
                <MenuItem value=" " selected={true}>-- Choose Role --</MenuItem>
                {
                    roles.map((item: { value: string, label: string}) => 
                        <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                    )
                }
            </Select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <TextField
            id="outlined-basic"
            label="Full Name"
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <TextField
            id="outlined-basic"
            label="E-mail Address"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <TextField
            id="outlined-basic"
            label="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <TextField
            id="outlined-basic"
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleInsertUser} variant="contained">
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}