import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHero from "../components/ProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";
import UserProfile from "../components/UserProfile";

const Profile = () => {
  const { name: urlName } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const name = urlName || UserProfile.getName();
      if (!name) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/profiles/profile/${name}`);
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

  const resumeData = userData.resume_data || {};

  return (
    <>
      <ProfileHero data={userData} />
      <div className="MuiBox-root flex overflow-hidden h-lvh lg:m-auto sm:m-0 lg:w-4/5 sm:w-full justify-around">
        <ProfileNav />
        <ProfileResume
          researchinterests={resumeData.researchinterests}
          biosketch={resumeData.biosketch}
          honors={resumeData.honors}
          students={resumeData.students}
          miscellaneous={resumeData.miscellaneous}
          research={resumeData.research}
          teacherengagement={resumeData.teacherengagement}
        />
      </div>
    </>
  );
};

export default Profile;
