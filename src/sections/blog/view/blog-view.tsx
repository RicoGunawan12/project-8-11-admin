import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import InsertBlogView from './insert-blog-view';
import axios from 'axios';
import { useToaster } from 'src/components/toast/Toast';
import PostComponent from '../post-component';

// ----------------------------------------------------------------------

type BlogPost = {
  postId: number;
  postTitle: string;
  postContent: string;
  postImage : string
  createdAt: string
};

export function BlogView() {

  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [update, setUpdate] = useState(false);
  const { showErrorToast, showSuccessToast } = useToaster();

  useEffect(() => {
    async function getPost() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/posts`);
        setBlog(response.data.posts);
        console.log(response.data.posts);
      } catch (error) {
        showErrorToast(error.message);
      }
    }
    getPost();
  }, [update]);

  return (
    <DashboardContent>
      {currPage === 1 ? (
        <div>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Blog
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setCurrPage(0)}
            >
              New Blog
            </Button>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
            {/* PostSearch component can be updated if needed */}
          </Box>

          <Grid container spacing={3}>
            {blog.map((post) => (
              <Grid key={post.postId} xs={12} sm={6} md={4}>
                <Link to={`${window.location.pathname}/${post.postId}`} style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        backgroundColor: 'background.default',
                      },
                    }}
                  >
                    <PostComponent postContent={post.createdAt} postImage={post.postImage} postTitle={post.postTitle}/>
                  </Box>
                </Link>
                    
              </Grid>
            ))}
          </Grid>

          {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
        </div>
      ) : (
        <div>
          <Button variant="contained" color="inherit" onClick={() => setCurrPage(1)}>
            Back
          </Button>
          <InsertBlogView changePage={setCurrPage} handleUpdate={() => setUpdate(!update)} />
        </div>
      )}
    </DashboardContent>
  );
}
