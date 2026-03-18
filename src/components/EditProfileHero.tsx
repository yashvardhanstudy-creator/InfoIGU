import React, { useState, useEffect, useRef } from "react";
import * as constants from "./constants";


interface ProfileData {
  name: string;
  profession: string;
  department: string;
  email: string;
  phone: string;
  profile_pic_url?: string;
}

const EditProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    profession: "",
    department: "",
    email: "",
    phone: "",
    profile_pic_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  // Simulate data fetching on component mount
  const fetchedDataOG = useRef<ProfileData | null>(null); // Use useRef to store initial data
  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // e.g., fetch('/api/profile').then(res => res.json()).then(data => setProfileData(data));
    const initialData: ProfileData = {
      name: "Pooja Singh",
      profession: "Assistant Professor",
      department: "Computer Science Dept.",
      email: "pooja.singh@example.com",
      phone: "+91-9876543210",
      profile_pic_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0'
    };
    fetchedDataOG.current = initialData;
    setProfileData(initialData);
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleExit = () => {
    if (fetchedDataOG.current) {
      setProfileData(fetchedDataOG.current); // Reset to original data on cancel
    }
    setIsEditing(false);
    // Optionally, you could reset profileData to the original fetched data here if you want to discard changes
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload to a server. 
    // Since we are saving to public/profile_picture, we simulate the path.
    // Note: Browser security prevents JS from writing directly to the filesystem.
    // This assumes your backend handles the actual move to the folder.
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `/profile_pictures/${fileName}`;

    setProfileData((prev) => ({
      ...prev,
      profile_pic_url: filePath,
    }));
  };

  const createJsonProfileData = (data: ProfileData) => {
    return JSON.stringify(data, null, 2); // Pretty print JSON with 2 space indent
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send the profileData to your backend API to save changes
    console.log("Saving changes:", profileData);
    console.log("JSON Profile Data:", createJsonProfileData(profileData));
    setIsEditing(false); // Exit editing mode after saving
    // You might want to add error handling or a success notification here
  };

  return (
    <>
      <form>
        <div
          className="flex flex-col md:flex-row w-[95%] lg:w-4/5 bg-[#1A365D] min-h-2/5 text-white m-auto rounded-b-2xl p-6 md:p-10 gap-6"
          style={{ padding: "2vh 5vw" }}
        >
          <div className="w-full md:w-2/5 flex flex-col justify-center items-center gap-4">
            <img
              className="rounded-2xl shadow-2xl w-48 h-48 md:w-3/5 md:h-auto object-cover"
              src={profileData.profile_pic_url || constants.PROFILE_PIC_URL}
              alt="Profile Pic"
            />
            {isEditing && (
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1 opacity-80">Upload New Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs w-48 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-[10px] mt-1 opacity-60">Path: {profileData.profile_pic_url}</p>
              </div>
            )}
          </div>
          <div className="w-full md:w-3/5 flex flex-col justify-between gap-4 text-center md:text-left">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  className="ml-2 text-white bg-blue-400 p-1 rounded" // Added styling for clarity
                  value={profileData.name}
                  name="name"
                  onChange={handleChange}
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold">{profileData.name}</h1>
              )}
              <div className="mt-1">
                {isEditing ? (
                  <input
                    type="text"
                    className="mb-4 text-white p-1 rounded bg-blue-400" // Added styling for clarity
                    value={profileData.profession}
                    name="profession"
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-lg opacity-90">{profileData.profession}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="flex items-center gap-2">
                <img
                  className="w-4"
                  src={constants.DEPARTMENT_SVG_WHITE}
                  alt="Department: "
                />
                {isEditing ? (
                  <input
                    type="text"
                    className="text-white p-1 rounded bg-blue-400" // Added styling for clarity
                    value={profileData.department}
                    name="department"
                    onChange={handleChange}
                  />
                ) : (
                  profileData.department
                )}
              </span>
              <span className="flex items-center gap-2">
                <img
                  className="w-4"
                  src={constants.EMAIL_SVG_WHITE}
                  alt="E-Mail: "
                />
                {isEditing ? (
                  <input
                    type="email" // Use type="email" for better validation
                    className="text-white p-1 rounded bg-blue-400" // Added styling for clarity
                    value={profileData.email}
                    name="email"
                    onChange={handleChange}
                  />
                ) : (
                  profileData.email
                )}
              </span>
              <span className="flex items-center gap-2">
                <img
                  className="w-4"
                  src={constants.PHONE_SVG_WHITE}
                  alt="Phone: "
                />
                {isEditing ? (
                  <input
                    type="tel" // Use type="tel" for phone numbers
                    className="text-white p-1 rounded bg-blue-400" // Added styling for clarity
                    value={profileData.phone}
                    name="phone"
                    onChange={handleChange}
                  />
                ) : (
                  profileData.phone
                )}
              </span>
            </div>
            <p className="text-[#cfdbe6] text-sm "></p>
            <div className="flex justify-center md:justify-end gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleExit}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

    </>
  );
};

export default EditProfile;
