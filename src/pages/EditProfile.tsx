import EditProfileHero from "../components/EditProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";
import UserProfile from "../components/UserProfile";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";




interface EditProfileProps {
  researchinterests?: string;
  biosketch?: string;
  research?: string;
  honors?: string;
  students?: string;
  miscellaneous?: string;
}

const EditProfile = (props: EditProfileProps) => {
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
        const response = await fetch(`http://localhost:5000/api/profiles/profile/${name}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        console.log(userData);
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
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-1 bg-[#1A365D] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-colors font-semibold flex items-center gap-2"
      >
        &larr; Go Back
      </button>
      <EditProfileHero user={userData} />
      <div className="flex overflow-hidden h-dvh lg:w-4/5 w-[95%] m-auto justify-around">
        <ProfileNav />
        <ProfileResume
          researchinterests={resumeData.researchinterests || 'sd'}
          biosketch={resumeData.biosketch || 'sd'}
          honors={resumeData.honors || 'sd'}
          students={resumeData.students || 'sd'}
          miscellaneous={resumeData.miscellaneous || 'sd'}
          research={resumeData.research || 'sd'}
          teacherengagement={resumeData.teacherengagement || 'sd'}
        />
      </div>
    </>
  );
};

export default EditProfile;
