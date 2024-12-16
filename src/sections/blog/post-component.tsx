import React from 'react';

interface Props {
  postImage: string;
  postTitle: string;
  postContent: string;
}

function PostComponent({ postImage, postTitle, postContent }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '15px',
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        border: '2px',
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
    >
      <div
        style={{
          width: '75px',
          height: '75px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #ddd',
          flexShrink: 0, // Prevent the image from shrinking
        }}
      >
        <img
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${import.meta.env.VITE_BACKEND_API}${postImage}`}
          alt="Post Thumbnail"
        />
      </div>

      <div style={{ marginLeft: '20px', flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#333',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {postTitle}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {postContent}
        </div>
      </div>
    </div>
  );
}


export default PostComponent;
