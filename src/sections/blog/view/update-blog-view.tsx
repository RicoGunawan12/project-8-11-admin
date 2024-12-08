import { useEffect, useState } from "react";
import { Typography, Button, TextField, CircularProgress } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useToaster } from "src/components/toast/Toast";

function UpdateBlogView() {
    const { id } = useParams<{ id: string }>();
    const [editorContent, setEditorContent] = useState<string>("");
    const [blogTitle, setBlogTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); // New loading state
    const nav = useNavigate();
    const { showErrorToast, showSuccessToast } = useToaster();

    const handleInsertBlog = async () => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/posts/${id}`,
                {
                    postTitle: blogTitle,
                    postContent: editorContent, 
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                }
            );
            showSuccessToast(response.data.message);
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                nav("/"); // Redirect if unauthorized
            }
            showErrorToast(error.response?.data?.message || "Something went wrong.");
        }
    };

    useEffect(() => {
        async function getBlog() {
            try {
                setLoading(true); // Set loading to true while fetching
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/posts/${id}`);
                // Set the state with fetched data
                setBlogTitle(response.data.post.postTitle);
                setEditorContent(response.data.post.postContent);
                console.log(response.data); // For debugging
            } catch (error) {
                showErrorToast(error.message);
            } finally {
                setLoading(false); // Set loading to false after data fetch is complete
            }
        }

        if (id) {
            getBlog();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Update Blog
            </Typography>

            <div style={{ marginBottom: "20px" }}>
                <TextField
                    label="Blog Title"
                    variant="outlined"
                    fullWidth
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)} 
                />
            </div>

            <div
                style={{
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                }}
            >
                <Editor
                    apiKey={`${import.meta.env.VITE_TINYMCE_API_KEY}`}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: "lists link image table",
                        toolbar:
                            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
                    }}
                    value={editorContent} // Set editor content to the state value
                    onEditorChange={(content) => setEditorContent(content)} 
                />
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
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

export default UpdateBlogView;
