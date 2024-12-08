import { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useToaster } from "src/components/toast/Toast";

type InsertBlogProps = {
    changePage: (curr: number) => void;
    handleUpdate: () => void;
};

function InsertBlogView({ changePage, handleUpdate }: InsertBlogProps) {
    const [editorContent, setEditorContent] = useState<string>("");
    const [blogTitle, setBlogTitle] = useState<string>("");
    const nav = useNavigate();
    const { showErrorToast, showSuccessToast } = useToaster();

    const handleInsertBlog = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/posts`,
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
            changePage(1);
            handleUpdate();
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 401) {
                nav("/");
            }
            showErrorToast(error.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div>
            <Typography variant="h4" style={{ textAlign: "center", marginBottom: "20px" }}>
                Insert Blog
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

export default InsertBlogView;
