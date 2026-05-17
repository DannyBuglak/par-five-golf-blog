import "./EditProfilePage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../features/auth/AuthContext";

function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url")
        .eq("id", user?.id)
        .single();

      if (data) {
        setUsername(data.username ?? "");
        setBio(data.bio ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }

      setLoading(false);
    };

    if (user) fetchProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setSaving(true);
    setError(null);

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      newAvatarUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: newAvatarUrl,
      })
      .eq("id", user?.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    navigate(`/profile/${username.trim()}`);
  };

  if (loading) return null;

  const displayAvatar = avatarPreview ?? avatarUrl;

  return (
    <main className="edit-profile">
      <div className="edit-profile__container">
        <div className="edit-profile__header">
          <h1>Edit Profile</h1>
          <p>Update your public profile information</p>
        </div>

        {error && <p className="edit-profile__error">{error}</p>}

        <div className="edit-profile__avatar-section">
          <div className="edit-profile__avatar">
            {displayAvatar ? (
              <img src={displayAvatar} alt="Avatar" />
            ) : (
              <div className="edit-profile__avatar-placeholder">
                {username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <label className="edit-profile__avatar-upload">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
          </label>
        </div>

        <div className="edit-profile__fields">
          <div className="edit-profile__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
            />
          </div>

          <div className="edit-profile__field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </div>

        <div className="edit-profile__footer">
          <button
            className="edit-profile__cancel"
            onClick={() => navigate(`/profile/${username}`)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="edit-profile__save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save →"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default EditProfilePage;
