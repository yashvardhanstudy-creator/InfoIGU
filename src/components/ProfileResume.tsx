import ShowResearch from "./ShowResearch";
import ShowPublication from "./ShowPublication";
import ShowBooks from "./ShowBooks";
import ShowPatents from "./ShowPatents";
import ShowGeneric from "./ShowGeneric";
import ShowProfession from "./ShowProfession";

const ProfileResume = (props: any) => {
  const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4 has-[+h2]:hidden last:hidden";
  console.log(props);
  return (
    <div className="sm:w-full w-auto bg-[#f0f0f0] p-2 hide-scrollbar min-h-20 rounded-2xl overflow-y-auto ">
      <>
        <h2 className={titleStyleh2} id="researchinterests">
          RESEARCH INTERESTS
        </h2>
        {props.researchInterests && (
          <p>{props.researchInterests}</p>
        )}
      </>
      <>
        <h2 className={titleStyleh2}>BIO SKETCH</h2>
        <ShowProfession name={props.name} id={props.id} type='education' heading="Educational Details" headingId="educationaldetails" editMode={props.editMode} />
        <ShowProfession name={props.name} id={props.id} type='profession' heading="Professional Background" headingId="professionalbackground" editMode={props.editMode} />
      </>
      <>
        <h2 className={titleStyleh2}>RESEARCH</h2>
        <ShowResearch id={props.id} heading="Projects" headingId="projects" editMode={props.editMode} />
        <ShowPublication id={props.id} heading="Publications" headingId="publications" editMode={props.editMode} />
        <ShowPatents id={props.id} heading="Patents" headingId="patents" editMode={props.editMode} />
        <ShowBooks id={props.id} heading="Books" headingId="books" editMode={props.editMode} />
        <ShowGeneric id={props.id} endpoint="collaborations" heading="Collaborations" headingId="collaborations" editMode={props.editMode} columns={[
          { key: "title", label: "Title", required: true },
          { key: "organization", label: "Organization" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>
      <>
        <h2 className={titleStyleh2}>HONORS & AWARDS</h2>
        <ShowGeneric id={props.id} endpoint="honors" heading="Honors" headingId="honors" editMode={props.editMode} columns={[
          { key: "title", label: "Title", required: true },
          { key: "date_issued", label: "Date Issued" },
          { key: "description", label: "Description" },
          { key: "url", label: "URL" },
        ]} />
        <ShowGeneric id={props.id} endpoint="memberships" heading="Memberships" headingId="memberships" editMode={props.editMode} columns={[
          { key: "organization", label: "Organization", required: true },
          { key: "role", label: "Role" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>
      <>
        <h2 className={titleStyleh2}>TEACHER ENGAGEMENT</h2>
        <ShowGeneric id={props.id} endpoint="teaching_engagements" heading="Teaching Engagements" headingId="teachingengagements" editMode={props.editMode} columns={[
          { key: "course_name", label: "Course Name", required: true },
          { key: "level", label: "Level" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>

      <>
        <h2 className={titleStyleh2}>STUDENTS</h2>
        <ShowGeneric id={props.id} endpoint="supervisions" heading="Supervisions" headingId="supervisions" editMode={props.editMode} columns={[
          { key: "student_name", label: "Student Name", required: true },
          { key: "topic", label: "Topic" },
          { key: "status", label: "Status" },
          { key: "date_range", label: "Date Range" },
        ]} />
        <ShowGeneric id={props.id} endpoint="associate_scholars" heading="Associate Scholars" headingId="associatescholars" editMode={props.editMode} columns={[
          { key: "scholar_name", label: "Scholar Name", required: true },
          { key: "topic", label: "Topic" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>
      <>
        <h2 className={titleStyleh2}>MISCELLANEOUS</h2>
        <ShowGeneric id={props.id} endpoint="events" heading="Events" headingId="events" editMode={props.editMode} columns={[
          { key: "event_name", label: "Event Name", required: true },
          { key: "role", label: "Role" },
          { key: "date_range", label: "Date Range" },
          { key: "location", label: "Location" },
        ]} />
        <ShowGeneric id={props.id} endpoint="visits" heading="Visits" headingId="visits" editMode={props.editMode} columns={[
          { key: "location", label: "Location", required: true },
          { key: "purpose", label: "Purpose" },
          { key: "date_range", label: "Date Range" },
        ]} />
        <ShowGeneric id={props.id} endpoint="administrative_positions" heading="Administrative Positions" headingId="administrative_positions" editMode={props.editMode} columns={[
          { key: "location", label: "Location", required: true },
          { key: "purpose", label: "Purpose" },
          { key: "date_range", label: "Date Range" },
        ]} />
        <ShowGeneric id={props.id} endpoint="miscellaneous" heading="Miscellaneous" headingId="miscellaneous" editMode={props.editMode} columns={[
          { key: "location", label: "Location", required: true },
          { key: "purpose", label: "Purpose" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>
    </div>
  );
};

export default ProfileResume;
