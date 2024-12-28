import { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useToaster } from 'src/components/toast/Toast';
import ImageInput from 'src/components/input/ImageInput';

type InsertBlogProps = {
  changePage: (curr: number) => void;
  handleUpdate: () => void;
};

function InsertBlogView({ changePage, handleUpdate }: InsertBlogProps) {
  const [editorContent, setEditorContent] = useState<string>('');
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const nav = useNavigate();
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleInsertBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('postTitle', blogTitle);
      formData.append('postContent', editorContent);
      if (selectedImage) {
        formData.append('postImage', selectedImage);
      }
      if (bannerImage) {
        formData.append('postBanner', bannerImage);
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast(response.data.message);
      changePage(1);
      handleUpdate();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        nav('/');
      }
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <TextField
          label="Blog Title"
          variant="outlined"
          fullWidth
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <Typography variant="h4" style={{ textAlign: 'left', marginBottom: '10px' }}>
    Blog Thumbnail
  </Typography>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ImageInput
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0] || null;
        setSelectedImage(file);
      }}
      name="Blog Thumbnail"
      width="250px" 
      height="250px"
    />

    {selectedImage && (
      <Typography variant="body2" color="textSecondary" style={{ marginLeft: '20px' }}>
        Selected File: {selectedImage.name}
      </Typography>
    )}

    
  </div>

  <div style={{ width: '100%', marginTop: '40px' }}>
    <Typography variant="h4" style={{ textAlign: 'left', marginBottom: '10px' }}>
      Blog Banner
    </Typography>

    <div style={{ width: '100%' }}>
      <ImageInput 
        width="100%" 
        height="200px" 
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0] || null;
          setBannerImage(file)
        }}
        initialFile={bannerImage}
        name="About Banner"
      />
    </div>
  </div>
</div>


      <div
        style={{
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <Editor
          apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
          init={{
            height: 500,
            menubar: false,
            plugins: 'lists link image table',
            toolbar:
              'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent',
          }}
          onEditorChange={(content) => setEditorContent(content)}
        />
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsertBlog}
          disabled={!blogTitle || !editorContent}
        >
          Submit Blog
        </Button>
      </div>
    </div>
  );
}

export default InsertBlogView;
