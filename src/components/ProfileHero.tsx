import * as constants from "./constants";

const ProfileHero = () => {
  const data = { name: "Pooja" };

  return (
    <div
      className="flex lg:flex-col sm:flex-row sm:w-full md:flex-row w-[95%] lg:w-4/5 bg-[#1A365D] min-h-2/5 text-blue-50 mt-4 m-auto rounded-2xl p-6 md:p-10 p-10 gap-6"
      style={{ padding: "2vh 5vw" }}
    >
      <div className="w-full md:w-2/5 flex justify-center items-center">
        <img
          className="rounded-2xl shadow-2xl w-48 h-48 md:w-3/5 md:h-auto object-cover"
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile Pic"
        />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-between gap-4 text-center md:text-left">
        <button className="md:self-end border-[#0067B3] border-2 px-4 py-2 rounded-xl hover:bg-[#ccefff] hover:text-[#353434] transition duration-200 font-bold text-sm">
          Download Resume
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{data.name}</h1>
          <div className="mt-1">
            <p className="text-lg opacity-90">Assistant Professor</p>
          </div>
        </div>
        <div>
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.DEPARTMENT_SVG_WHITE}
              alt="Department: "
            />
            Department of Computer Science
          </span>
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.EMAIL_SVG_WHITE}
              alt="E-Mail: "
            />
            pooja@igu.ac.in
          </span>
          <span className="flex items-center gap-2">
            <img
              className="w-4"
              src={constants.PHONE_SVG_WHITE}
              alt="Phone: "
            />
            +91 9876543210
          </span>
        </div>
        <p className="text-[#cfdbe6] text-sm"></p>
      </div>
    </div>
  );
};

export default ProfileHero;
