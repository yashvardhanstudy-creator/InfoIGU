import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditProfileHero from "../components/EditProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";
import UserProfile from "../components/UserProfile";
import * as constants from "../components/constants";

const Profile = () => {
  const { name: urlName } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const name = urlName || UserProfile.getName();
      if (!name) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${constants.SERVER_URL}api/profiles/profile/${name}`);
        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [urlName]);

  if (loading) return <div className="text-center mt-10 text-[#1A365D] font-bold">Loading Profile...</div>;
  if (!userData) return <div className="text-center mt-10 text-red-500 font-bold">Profile not found. Please log in.</div>;


  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-1 bg-[#1A365D] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-colors font-semibold flex items-center gap-2"
      >
        &larr; Go Back
      </button>
      <EditProfileHero data={userData} editMode={false} />
      <div className="MuiBox-root flex overflow-hidden h-lvh lg:m-auto sm:m-0 lg:w-4/5 sm:w-full justify-around">
        <ProfileNav />

        <ProfileResume
          researchInterests={userData.research_interests}
          name={urlName}
          id={userData.id}
          editMode={false}

        />
      </div>
    </>
  );
};

export default Profile;
