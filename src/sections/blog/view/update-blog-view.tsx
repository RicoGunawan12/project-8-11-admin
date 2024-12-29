import { useEffect, useState } from 'react';
import { Typography, Button, TextField, CircularProgress } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useToaster } from 'src/components/toast/Toast';
import ImageInput from 'src/components/input/ImageInput';

function UpdateBlogView() {
  const { id } = useParams<{ id: string }>();
  const [editorContent, setEditorContent] = useState<string>('');
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const nav = useNavigate();
  const { showErrorToast, showSuccessToast } = useToaster();

  const handleUpdateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('postTitle', blogTitle);
      formData.append('postContent', editorContent);
      if (imageFile) {
        formData.append('postImage', imageFile); // Append the new image file
      }
      if (bannerImage) {
        formData.append('postBanner', bannerImage); // Append the new image file
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/posts/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${Cookies.get('tys-token')}`,
          },
        }
      );
      showSuccessToast(response.data.message);
      nav('/blog');
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        nav('/'); // Redirect if unauthorized
      }
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('tys-token')}`,
        },
      });
      showSuccessToast(response.data.message);
      nav('/blog');
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        nav('/'); // Redirect if unauthorized
      }
      showErrorToast(error.response?.data?.message || 'Something went wrong.');
    }
  };

  async function convertToFile(url: string) {
    // Fetch the image as a Blob
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a new File object from the Blob
    const file = new File([blob], 'test', { type: blob.type });

    return file;
  }

  useEffect(() => {
    async function getBlog() {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/posts/${id}`);
        setBlogTitle(response.data.post.postTitle);
        setEditorContent(response.data.post.postContent);
        setImageFile(
          await convertToFile(`${import.meta.env.VITE_BACKEND_API}${response.data.post.postImage}`)
        );
        setBannerImage(
          await convertToFile(`${import.meta.env.VITE_BACKEND_API}${response.data.post.postBanner}`)
        )
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: '20px' }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            nav(-1);
          }}
          disabled={!blogTitle || !editorContent}
        >
          Back
        </Button>
        <Typography variant="h4" style={{ textAlign: 'center', flexGrow: 1 }}>
          Update Blog
        </Typography>
      </div>

      <div style={{ marginBottom: '20px', marginLeft: '20px' }}>
        <TextField
          label="Blog Title"
          variant="outlined"
          fullWidth
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '20px', marginLeft: '20px' }}>
        <div>
          <Typography variant="h4" style={{ textAlign: 'left', flexGrow: 1 }}>
            Current Image
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <ImageInput
            initialFile={imageFile}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0] || null;
              setImageFile(file);
            }}
            name="Blog Thumbnail"
            width="250px" 
            height="250px"
          />
        </div>
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
          value={editorContent}
          onEditorChange={(content) => setEditorContent(content)}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteBlog}
          disabled={!blogTitle || !editorContent}
        >
          Delete Blog
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateBlog}
          disabled={!blogTitle || !editorContent}
        >
          Submit Blog
        </Button>
      </div>
    </div>
  );
}

export default UpdateBlogView;
