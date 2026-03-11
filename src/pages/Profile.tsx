import ProfileHero from "../components/ProfileHero";
import ProfileNav from "../components/ProfileNav3";
import ProfileResume from "../components/ProfileResume";

const Profile = (props: any) => {
    console.log(props);
    return (
        <>
            <ProfileHero />
            <div className="MuiBox-root flex overflow-hidden h-lvh m-auto w-4/5 justify-around">
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
