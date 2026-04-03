import { useEffect, useState } from 'react';
import DepartmentCard from './DepartmentCard'
import ProfileCard from './ProfileCard'
import * as constants from './constants'


const Showcase = (props: any) => {
  const [Profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  const [Card, setCard] = useState([]); // Do Not Remove

  useEffect(() => {
    const fetchProfileData = async () => {

      try {
        setLoading(true);
        const response = await fetch(`${constants.SERVER_URL}api/show/`);
        const data = await response.json();
        if (data && data.length > 0) {
          const filteredProfiles = data.filter((user: any) =>
            user.name?.toLowerCase() !== 'dev' && user.name?.toLowerCase() !== 'admin'
          );
          setProfile(filteredProfiles);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);
  // console.log(Profile);
  if (loading) return <div>Loading...</div>

  if (props.type === 'department') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Card.map((dept: any) => (
          <DepartmentCard key={dept.id} department={dept} />
        ))}
      </div>
    )
  } else {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {Profile.map((user: any) => (
            <ProfileCard key={user.id} user={user} />
          ))}
        </div>
      </>
    )
  }

}


export default Showcase