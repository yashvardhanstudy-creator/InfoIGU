import ShowProfession from "./ShowProfession";
import ShowData from "./ShowData";
import * as constants from "./constants";
import ShowResearch from "./ShowResearch";
import ShowPublication from "./ShowPublication";

const ProfileResume = (props: any) => {
  const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4";
  const titleStyleh3 = "text-xl  mb-4";
  return (
    <div className="sm:w-full w-auto bg-[#f0f0f0] p-2 hide-scrollbar min-h-20 rounded-2xl overflow-y-auto ">
      {props.researchinterests && (
        <>
          <h2 className={titleStyleh2} id="researchinterests">
            RESEARCH INTERESTS
          </h2>
          <p>{props.researchinterests}</p>
        </>
      )}
      {props.biosketch && (
        <>
          <h2 className={titleStyleh2}>BIO SKETCH</h2>
          <h3 className={titleStyleh3} id="educationaldetails">
            Educational Details
          </h3>
          <ShowProfession data={constants.professionData} />
          <h3 className={titleStyleh3} id="professionalbackground">
            Proffessional Background
          </h3>
          <ShowProfession data={constants.professionData} />
        </>
      )}
      {props.research && (
        <>
          <h2 className={titleStyleh2}>RESEARCH</h2>
          <h3 className={titleStyleh3} id="projects">
            Projects
          </h3>
          <ShowResearch />
          <h3 className={titleStyleh3} id="publications">
            Publications
          </h3>
          <ShowPublication data={constants.publicationData} />
          <h3 className={titleStyleh3} id="patents">
            Patents
          </h3>
          <ShowData />
          <h3 className={titleStyleh3} id="books">
            Books
          </h3>
          <ShowData />
          <h3 className={titleStyleh3} id="collaborations">
            Collaborations
          </h3>
          <ShowData />
        </>
      )}
      {props.honors && (
        <>
          <h2 className={titleStyleh2}>HONORS & AWARDS</h2>
          <h3 className={titleStyleh3} id="honors">
            Honors
          </h3>
          <ShowProfession data={constants.professionData} />
          {/* <ShowProfession /> */}
          <h3 className={titleStyleh3} id="memberships">
            Memberships
          </h3>
          <ShowProfession data={constants.professionData} />
          {/* <ShowProfession /> */}
        </>
      )}
      {props.teacherengagement && (
        <>
          <h2 className={titleStyleh2}>TEACHER ENGAGEMENT</h2>
          <ShowProfession data={constants.professionData} />
        </>
      )}

      {props.students && (
        <>
          <h2 className={titleStyleh2}>STUDENTS</h2>
          <h3 className={titleStyleh3} id="supervisions">
            Supervisions
          </h3>
          <ShowProfession data={constants.professionData} />
          {/* <ShowProfession /> */}
          <h3 className={titleStyleh3} id="associatescholars">
            Associate Scholars
          </h3>
          <ShowProfession data={constants.professionData} />
          {/* <ShowProfession /> */}
        </>
      )}
      {props.miscellaneous && (
        <div>
          <h2 className={titleStyleh2}>MISCELLANEOUS</h2>
          <h3 className={titleStyleh3} id="supervisions">
            Supervisions
          </h3>
          <ShowProfession data={constants.professionData} />

          {/* <ShowProfession /> */}
          <h3 className={titleStyleh3} id="associatescholars">
            Associate Scholars
          </h3>
          <ShowProfession data={constants.professionData} />

          {/* <ShowProfession /> */}
        </div>
      )}
    </div>
  );
};

export default ProfileResume;
