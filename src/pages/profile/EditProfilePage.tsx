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

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image must be smaller than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
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
      try {
        // Get file extension, fallback to 'jpg' if missing
        const fileExt = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const filePath = `${user?.id}/avatar-${timestamp}.${fileExt}`;

        console.log("Uploading file:", {
          path: filePath,
          size: avatarFile.size,
          type: avatarFile.type,
        });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError(`Upload failed: ${uploadError.message}`);
          setSaving(false);
          return;
        }

        console.log("Upload successful:", uploadData);

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        newAvatarUrl = urlData.publicUrl;
      } catch (err) {
        console.error("Upload exception:", err);
        setError("Failed to upload image. Please try again.");
        setSaving(false);
        return;
      }
    }

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          bio: bio.trim(),
          avatar_url: newAvatarUrl,
        })
        .eq("id", user?.id);

      if (updateError) {
        console.error("Update error:", updateError);
        setError(updateError.message);
        setSaving(false);
        return;
      }

      navigate(`/profile/${username.trim()}`);
    } catch (err) {
      console.error("Update exception:", err);
      setError("Failed to save profile. Please try again.");
      setSaving(false);
    }
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