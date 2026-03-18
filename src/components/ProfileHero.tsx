import * as constants from "./constants";

interface ProfileHeroProps {
  data: {
    name: string;
    designation?: string;
    department?: string;
    email?: string;
    phone?: string;
    resume_data?: any;
    profile_pic_url?: string;
  };
}

const ProfileHero = ({ data }: ProfileHeroProps) => {
  return (
    <div
      className="flex flex-col md:flex-row w-[95%] lg:w-4/5 bg-[#1A365D] min-h-2/5 text-white m-auto rounded-2xl p-6 md:p-10 gap-6 mt-4"
      style={{ padding: "2vh 5vw" }}
    >
      <div className="w-full md:w-2/5 flex justify-center items-center">
        <img
          src={`${constants.SERVER_URL}${data.name}_${data.department}.png`}
          onError={(e) => { e.currentTarget.src = constants.PROFILE_PIC_URL; }}
          alt={data.name}
          className="size-16 md:size-24 lg:size-32 rounded-full object-cover"
        />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-between gap-4 text-center md:text-left">
        <button className="md:self-end border-[#0067B3] border-2 px-4 py-2 rounded-xl hover:bg-[#ccefff] hover:text-[#353434] transition duration-200 font-bold text-sm">
          Download Resume
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{data.name}</h1>
          <div className="mt-1">
            <p className="text-lg opacity-90">{data.designation || "Unknown"}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 md:items-start">
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.DEPARTMENT_SVG_WHITE}
              alt="Department: "
            />
            {data.department || "Department of Computer Science"}
          </span>
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.EMAIL_SVG_WHITE}
              alt="E-Mail: "
            />
            {data.email || `${data.name.toLowerCase().replace(/\s+/, "")}@igu.ac.in`}
          </span>
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.PHONE_SVG_WHITE}
              alt="Phone: "
            />
            {data.phone || "N/A"}
          </span>
        </div>
        <p className="text-[#cfdbe6] text-sm"></p>
      </div>
    </div>
  );
};

export default ProfileHero;
