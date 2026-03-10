import { useEffect, useState } from 'react';
import DepartmentCard from './DepartmentCard'
import ProfileCard from './ProfileCard'


const Showcase = (props: any) => {
  const [Profile, setProfile] = useState([]);
  const [Department, setDepartment] = useState([]);

  useEffect(() => {
    // Fetching from the public folder root
    fetch('/demo.json')
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);
  useEffect(() => {
    // Fetching from the public folder root
    fetch('/dept.json')
      .then((response) => response.json())
      .then((data) => setDepartment(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);
  console.log(Profile);
  console.log(Department);

  if (props.type === 'department') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Department.map((dept: any) => (
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