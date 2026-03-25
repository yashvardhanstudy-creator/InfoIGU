import * as React from "react";
import ShowResearch from "./ShowResearch";
import ShowPublication from "./ShowPublication";
import ShowBooks from "./ShowBooks";
import ShowPatents from "./ShowPatents";
import ShowGeneric from "./ShowGeneric";
import ShowProfession from "./ShowProfession";
import Button from "@mui/material/Button";

const ProfileResume = (props: any) => {
  const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4 has-[+h2]:hidden last:hidden";

  const [isEditingRI, setIsEditingRI] = React.useState(false);
  const [researchInterests, setResearchInterests] = React.useState(props.researchInterests || "");

  React.useEffect(() => {
    setResearchInterests(props.researchInterests || "");
  }, [props.researchInterests]);

  const handleSaveRI = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/research_interests/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ research_interests: researchInterests }),
      });
      if (response.ok) {
        setIsEditingRI(false);
      }
    } catch (error) {
      console.error("Error saving research interests:", error);
    }
  };

  return (
    <div className="sm:w-full w-auto bg-[#f0f0f0] p-2 hide-scrollbar min-h-20 rounded-2xl overflow-y-auto ">
      <>
        <h2 className={titleStyleh2} id="researchinterests">
          RESEARCH INTERESTS
        </h2>
        {(props.editMode || researchInterests) && (
          <div className="mb-6">
            {isEditingRI ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border-b-2 focus:outline-none focus:border-blue-500 rounded bg-transparent"
                  rows={4}
                  value={researchInterests}
                  onChange={(e) => setResearchInterests(e.target.value)}
                  placeholder="Enter your research interests..."
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSaveRI}>Save</Button>
                  <Button onClick={() => { setResearchInterests(props.researchInterests || ""); setIsEditingRI(false); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="whitespace-pre-wrap">{researchInterests}</p>
                {props.editMode && (
                  <Button className="mt-2" variant="outlined" size="small" onClick={() => setIsEditingRI(true)}>Edit</Button>
                )}
              </div>
            )}
          </div>
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
          { key: "url", label: "URL" },
          { key: "description", label: "Description" },
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
          { key: "code", label: "Code" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>

      <>
        <h2 className={titleStyleh2}>STUDENTS</h2>
        <ShowGeneric id={props.id} endpoint="supervisions" heading="Supervisions" headingId="supervisions" editMode={props.editMode} columns={[
          { key: "topic", label: "Topic", required: true },
          { key: "other_supervisors", label: "Other Supervisors" },
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
        <ShowGeneric id={props.id} endpoint="administrative_positions" heading="Administrative Positions" headingId="administrativepositions" editMode={props.editMode} columns={[
          { key: "position", label: "Position", required: true },
          { key: "organization", label: "Organisation" },
          { key: "date_range", label: "Date Range" },
        ]} />
        <ShowGeneric id={props.id} endpoint="miscellaneous" heading="Miscellaneous" headingId="miscellaneous" editMode={props.editMode} columns={[
          { key: "title", label: "Title", required: true },
          { key: "description", label: "Description" },
          { key: "date_range", label: "Date Range" },
        ]} />
      </>
    </div>
  );
};

export default ProfileResume;
