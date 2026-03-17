import ProfileHero from "../components/ProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";

const Profile = () => {
  return (
    <>
      <ProfileHero />
      <div className="MuiBox-root flex overflow-hidden h-lvh lg:m-auto sm:m-0 lg:w-4/5 sm:w-full justify-around">
        <ProfileNav />
        <ProfileResume
          researchinterests="research"
          biosketch="hell"
          honors="f"
          students="s"
          miscellaneous="sa"
          research="hello"
        />
      </div>
    </>
  );
};

export default Profile;
