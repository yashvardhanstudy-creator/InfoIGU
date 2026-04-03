import React, { useState, useEffect, useRef } from "react";
import * as constants from "./constants";


interface ProfileData {
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  profile_pic_url?: string;
  oldname?: string;
  image?: File;
}

const EditProfile = (props: any) => {
  const { data, editMode } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    profile_pic_url: "",
  });
  // Simulate data fetching on component mount
  const fetchedDataOG = useRef<ProfileData | null>(null); // Use useRef to store initial data
  const [imageFile, setImageFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const initialData: ProfileData = {
      name: data.name,
      designation: data.designation,
      department: data.department,
      email: data.email,
      phone: data.phone,
      profile_pic_url: constants.SERVER_URL + "default.png",
    };

    const fetchImage = async () => {
      try {
        const imageUrl = constants.SERVER_URL + data.name + "_" + data.department + ".png";
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], `${data.name}_${data.department}.png`, { type: blob.type });
          setImageFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          initialData.profile_pic_url = imageUrl;
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      } finally {
        fetchedDataOG.current = initialData;
        setProfileData(initialData);
      }
    };

    fetchImage();
  }, [data]); // Add data to dependency array

  const handleExit = () => {
    if (fetchedDataOG.current) {
      setProfileData(fetchedDataOG.current); // Reset to original data on cancel
    }
    setIsEditing(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a local URL for preview
    }

  };


  const handleSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("designation", profileData.designation);
    formData.append("department", profileData.department);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    if (fetchedDataOG.current?.name) {
      formData.append("oldname", fetchedDataOG.current.name);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    fetch(`${constants.SERVER_URL}api/update`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })

    // console.log("Saving changes:", profileData);
    setIsEditing(false);

  };

  return (
    <>
      <form>
        <div
          className="flex flex-col md:flex-row w-[95%] lg:w-4/5 bg-[#1A365D] min-h-2/5 text-white m-auto rounded-b-2xl p-6 md:p-10 gap-6"
          style={{ padding: "2vh 5vw" }}
        >
          <div className="w-full md:w-2/5 flex flex-col justify-center items-center gap-4">
            {/* <img
              className="rounded-2xl shadow-2xl w-48 h-48 md:w-3/5 md:h-auto object-cover"
              src={previewUrl || profileData.profile_pic_url || constants.SERVER_URL + "default.png"}
              alt="Profile Pic"
            /> */}
            <img
              src={previewUrl || `${constants.SERVER_URL}${data.name}_${data.department}.png`}
              onError={(e) => { e.currentTarget.src = constants.PROFILE_PIC_URL; }}
              alt={profileData.name}
              className="size-20 md:size-28 lg:size-36 rounded-full object-cover border-4 border-white/20 shadow-lg"
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
                  className="ml-2 text-black bg-white/90 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-auto font-bold"
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
                    className="mb-4 ml-2 text-black bg-white/90 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full md:w-auto"
                    value={profileData.designation}
                    name="designation"
                    onChange={handleChange}
                  />
                ) : (
                  <p className="text-lg opacity-90">{profileData.designation}</p>
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
                    className="text-black bg-white/90 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
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
                    className="text-black bg-white/90 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
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
                    className="text-black bg-white/90 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
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
              {editMode ? (
                <>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleExit}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-sm"
                      >
                        Cancel
                      </button>
                    </>

                  ) : (
                    <button
                      type="button"
                      onClick={() => { setIsEditing(true); }}
                      className="bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-2 px-5 rounded-lg transition-all shadow-sm backdrop-blur-sm"
                    >
                      Edit Profile
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => window.open(`/resume/${encodeURIComponent(data.name)}`, '_blank')}
                  className="border-[#0067B3] border-2 px-4 py-2 rounded-xl hover:bg-[#ccefff] hover:text-[#353434] transition duration-200 font-bold text-sm">
                  Download Resume
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
