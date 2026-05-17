import "./ProfilePage.css";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";
import FeedCard from "../../features/feed/FeedCard";
import type { Post } from "../../features/feed/useFeedPosts";

interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
}

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("id, username, bio, avatar_url")
        .eq("username", username)
        .single();

      if (error || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: postData } = await supabase
        .from("posts")
        .select(
          "id, title, slug, content, created_at, signature, profiles!posts_author_id_fkey(username), post_tags(tag_id, tags(name))",
        )
        .eq("author_id", profileData.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (postData) setPosts(postData as unknown as Post[]);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

  const isOwner = user?.id === profile?.id;

  if (loading)
    return (
      <main className="profile">
        <div className="profile__container">
          <p className="profile__loading">Loading...</p>
        </div>
      </main>
    );

  if (notFound)
    return (
      <main className="profile">
        <div className="profile__container">
          <p className="profile__not-found">Profile not found.</p>
          <Link to="/feed" className="profile__back">
            ← Back to Feed
          </Link>
        </div>
      </main>
    );

  if (!profile) return null;

  return (
    <main className="profile">
      <div className="profile__container">
        <div className="profile__header">
          <div className="profile__avatar">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} />
            ) : (
              <div className="profile__avatar-placeholder">
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile__info">
            <h1 className="profile__username">{profile.username}</h1>
            {profile.bio && <p className="profile__bio">{profile.bio}</p>}
            <p className="profile__post-count">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {isOwner && (
            <Link to="/profile/edit" className="profile__edit-btn">
              Edit Profile →
            </Link>
          )}
        </div>

        <div className="profile__divider" />

        {posts.length === 0 ? (
          <div className="profile__empty">
            <p>No published posts yet.</p>
            {isOwner && (
              <Link to="/write" className="profile__empty-btn">
                Start Writing →
              </Link>
            )}
          </div>
        ) : (
          <div className="profile__posts">
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;
