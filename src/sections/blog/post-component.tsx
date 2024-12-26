import React, { useState } from 'react';

// Helper function to format the date into a readable format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  postImage: string;
  postTitle: string;
  postContent: string;
}

function PostComponent({ postImage, postTitle, postContent }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReadMoreClick = () => {
    setIsExpanded((prev) => !prev);
  };

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
          flexShrink: 0,
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
            WebkitLineClamp: isExpanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>{formatDate(postContent)}</span>
          {!isExpanded && (
            <span
              onClick={handleReadMoreClick}
              style={{ color: '#007bff', cursor: 'pointer' }}
            >
              Read more &gt;&gt;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostComponent;
