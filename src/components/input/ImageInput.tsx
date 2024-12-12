import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export interface InputFileProps {
  name: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  initialFile?: File | null;
  imageString?: string | null;
}

function ImageInput({ onChange, name, initialFile, imageString }: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current != null) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (e: any) => {
    onChange(e);
    setPreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  useEffect(() => {
    console.log(initialFile);
    
    if (initialFile) {
      const url = URL.createObjectURL(initialFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    else {
      console.log(imageString);
      
      setPreviewUrl(imageString ? import.meta.env.VITE_BACKEND_API + imageString : "")
    }
  }, [initialFile]);

  return (
    <div style={{ display:'flex', alignItems:'center'}}>
        <style>
            {`
            .hover-pointer {
                cursor: pointer;
            }
            .hover-pointer:hover {
                cursor: pointer;
            }
            `}
        </style>
      <div>
        <input
          name={name}
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => handleChange(e)}
          style={{ display:'none' }}
        ></input>
        <div onClick={handleButtonClick} className="hover-pointer">
          {previewUrl ? (
            <img
              src={previewUrl}
            //   className="flex h-[140px] w-[100px] rounded-md border-[1px] border-[gray] object-cover object-center"
              style={{ display:'flex', width:'20vw', height:'15vw', borderRadius:'4px #DBDCDC', objectPosition: 'center', objectFit: 'cover' }}
            />
          ) : (
            <div 
                style={{ display:'flex', width:'15vw', height:'15vw', alignItems: 'center', border: 'solid 3px #DBDCDC', justifyContent: 'center', borderRadius:'4px', fontSize: '1vw', color: 'gray' }}
                className="flex h-[140px] w-[100px] items-center justify-center rounded-md border-2 border-[gray] text-[5px] text-[gray]">
              <div>+</div>
              <div
                onClick={handleButtonClick}
                // className="ml-2 text-[gray] hover:cursor-pointer"
                className="hover-pointer"
                style={{ marginLeft:'4px', color: 'gray' }}
                >
                    Insert { name }
                </div>
            </div>
          )}
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default ImageInput;