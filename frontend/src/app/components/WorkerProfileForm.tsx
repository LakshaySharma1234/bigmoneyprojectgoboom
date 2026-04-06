import { useEffect, useState } from "react";

import { api } from "../services/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const defaultProfile = {
  skills: "",
  experience: "",
  availability: "",
  profile_picture_url: "",
  avg_rating: 0,
  reliability_score: 0,
};

export function WorkerProfileForm() {
  const [form, setForm] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await api.get("/workers/me/profile");
        if (profile) {
          setForm({
            skills: profile.skills ?? "",
            experience: profile.experience ?? "",
            availability: profile.availability ?? "",
            profile_picture_url: profile.profile_picture_url ?? "",
            avg_rating: profile.avg_rating ?? 0,
            reliability_score: profile.reliability_score ?? 0,
          });
        }
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : "Unable to load profile.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.put("/workers/me/profile", {
        skills: form.skills,
        experience: form.experience,
        availability: form.availability,
        profile_picture_url: form.profile_picture_url,
      });
      setSuccessMessage("Profile saved successfully.");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save profile.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-500">Average Rating</p>
          <p className="text-2xl font-semibold text-slate-900">
            {Number(form.avg_rating ?? 0).toFixed(1)} / 5
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Reliability Badge</p>
          <p className="text-2xl font-semibold text-emerald-700">
            {Number(form.reliability_score ?? 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          value={form.skills}
          onChange={(event) => updateField("skills", event.target.value)}
          placeholder="Waiter, bartender, banquet setup"
        />
      </div>
      <div>
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          value={form.experience}
          onChange={(event) => updateField("experience", event.target.value)}
          placeholder="2 years in wedding and corporate events across Mumbai."
        />
      </div>
      <div>
        <Label htmlFor="availability">Availability</Label>
        <Input
          id="availability"
          value={form.availability}
          onChange={(event) => updateField("availability", event.target.value)}
          placeholder="Weekends, evenings, immediate"
        />
      </div>
      <div>
        <Label htmlFor="profile-picture-url">Profile Picture URL</Label>
        <Input
          id="profile-picture-url"
          value={form.profile_picture_url}
          onChange={(event) => updateField("profile_picture_url", event.target.value)}
          placeholder="https://example.com/profile.jpg"
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
