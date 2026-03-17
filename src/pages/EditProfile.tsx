import EditProfileHero from "../components/EditProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";



interface EditProfileProps {
  researchinterests?: string;
  biosketch?: string;
  research?: string;
  honors?: string;
  students?: string;
  miscellaneous?: string;
}

const EditProfile = (props: EditProfileProps) => {

  return (
    <>
      <EditProfileHero />
      <div className="flex overflow-hidden h-dvh lg:w-4/5 w-[95%] m-auto justify-around">
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

export default EditProfile;
