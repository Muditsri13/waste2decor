import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Awareness() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ text: "" });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/posts/all");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const submit = async e => {
    e.preventDefault();
    if (!user) { toast.error("Please login to post"); return; }
    if (!form.text.trim()) { toast.error("Please enter some text"); return; }

    const formData = new FormData();
    formData.append("userId", user._id || user.id || localStorage.getItem("userId"));
    formData.append("author", user.name);
    formData.append("text", form.text);
    if (imgFile) {
      formData.append("image", imgFile);
    }

    try {
      await axios.post("http://localhost:5001/api/posts/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({ text: "" });
      setImgFile(null);
      setImgPreview(null);
      toast.success("Posted successfully! 🌱");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to upload post");
    }
  };

  const handleLike = async (postId) => {
    if (!user) { toast.error("Please login to like posts"); return; }
    try {
      await axios.put(`http://localhost:5001/api/posts/like/${postId}`, {
        userId: user._id || localStorage.getItem("userId")
      });
      fetchPosts(); // Refresh to get new like count
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (postId) => {
    if (!user) { toast.error("Please login to comment"); return; }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      await axios.post(`http://localhost:5001/api/posts/comment/${postId}`, {
        userId: user._id || localStorage.getItem("userId"),
        author: user.name,
        text: text.trim()
      });
      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchPosts(); // Refresh to get new comments
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-success mb-4 fw-bold text-center">Awareness Hub 🌍</h2>

      {/* CREATE POST SECTION */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
        <h5 className="mb-3 fw-bold">Create a Post</h5>
        <form onSubmit={submit}>
          <textarea 
            className="form-control mb-3 border-0 bg-light" 
            rows="3" 
            placeholder="Share an eco-friendly tip or story..." 
            value={form.text} 
            onChange={e=>setForm({text:e.target.value})}
            required
            style={{ resize: "none" }}
          ></textarea>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <label htmlFor="postImage" className="btn btn-outline-secondary rounded-pill me-2">
                📷 Add Image
              </label>
              <input type="file" id="postImage" accept="image/*" className="d-none" onChange={onFile} />
            </div>
            <button className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">Post to Hub</button>
          </div>

          {imgPreview && (
            <div className="mt-3 position-relative d-inline-block">
              <img src={imgPreview} alt="preview" className="img-fluid rounded" style={{maxHeight: "150px", objectFit: "cover"}} />
              <button 
                type="button" 
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                onClick={() => { setImgPreview(null); setImgFile(null); }}
              >✕</button>
            </div>
          )}
        </form>
      </div>

      {/* POSTS FEED */}
      <div>
        {loading ? (
          <p className="text-center text-muted">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No posts yet. Be the first to share an eco-tip! 🌱</h5>
          </div>
        ) : (
          posts.map(p => {
            const hasLiked = user && p.likes && p.likes.includes(user._id || localStorage.getItem("userId"));
            return (
              <div key={p._id} className="card shadow-sm mb-4 border-0 rounded-4 overflow-hidden">
                <div className="card-body p-4">
                  
                  {/* POST HEADER */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: "45px", height: "45px", fontSize: "20px" }}>
                      {p.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark">{p.author}</h5>
                      <small className="text-muted">{new Date(p.createdAt).toLocaleString()}</small>
                    </div>
                  </div>

                  {/* POST CONTENT */}
                  <p className="fs-5">{p.text}</p>
                  {p.image && (
                    <img 
                      src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`} 
                      alt="post" 
                      className="img-fluid rounded-4 mt-2 w-100" 
                      style={{ maxHeight: "500px", objectFit: "cover" }} 
                    />
                  )}

                  {/* LIKE BUTTON */}
                  <div className="mt-4 pt-3 border-top d-flex align-items-center">
                    <button 
                      className={`btn btn-sm rounded-pill px-3 me-3 ${hasLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => handleLike(p._id)}
                    >
                      {hasLiked ? '❤️ Liked' : '🤍 Like'} <span className="badge bg-white text-danger ms-1">{p.likes?.length || 0}</span>
                    </button>
                    <span className="text-muted small">{p.comments?.length || 0} Comments</span>
                  </div>

                  {/* COMMENTS SECTION */}
                  <div className="mt-4 bg-light p-3 rounded-4">
                    {/* Add Comment */}
                    <div className="d-flex mb-3">
                      <input 
                        type="text" 
                        className="form-control rounded-pill border-0 me-2" 
                        placeholder="Write a comment..." 
                        value={commentInputs[p._id] || ""}
                        onChange={(e) => setCommentInputs({...commentInputs, [p._id]: e.target.value})}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(p._id)}
                      />
                      <button className="btn btn-primary rounded-pill fw-bold px-3" onClick={() => handleComment(p._id)}>Post</button>
                    </div>

                    {/* Display Comments */}
                    {p.comments && p.comments.length > 0 && (
                      <div className="d-flex flex-column gap-2">
                        {p.comments.map((c, idx) => (
                          <div key={idx} className="bg-white p-2 px-3 rounded-3 shadow-sm border">
                            <span className="fw-bold me-2 text-dark">{c.author}</span>
                            <span className="text-secondary">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
