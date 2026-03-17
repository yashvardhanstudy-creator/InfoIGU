import * as React from "react";
import { Menu, X } from "lucide-react";

const ProfileNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const vertical_list_nest =
    document.getElementsByClassName("one-liner-captions");

  const list_sub_heading = document.getElementsByClassName("sub-heading");
  for (let i = 0; i < vertical_list_nest.length; i++) {
    var id = vertical_list_nest[i].innerHTML.toLowerCase();
    vertical_list_nest[i].setAttribute("id", id.replace(/\s/g, "") + "d");
  }

  for (let i = 0; i < list_sub_heading.length; i++) {
    var id = list_sub_heading[i].innerHTML.toLowerCase();
    list_sub_heading[i].setAttribute("id", id.replace(/\s/g, ""));
  }

  function head_click(id: any) {
    const element = document.getElementById(id);
    if (!element) return;

    let sub_heading = element.nextElementSibling as HTMLElement | null;

    if (sub_heading && sub_heading.tagName === "HR") {
      sub_heading = sub_heading.nextElementSibling as HTMLElement | null;
    }

    if (!sub_heading) return;

    if (
      sub_heading.style.display === "none" ||
      sub_heading.style.display === ""
    ) {
      sub_heading.style.display = "block";
    } else {
      sub_heading.style.display = "none";
    }
  }

  function content_click(id: any) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Handle active class styling
    const active_items = document.getElementsByClassName("active-list-item");
    while (active_items.length > 0) {
      active_items[0].classList.remove("active-list-item");
    }

    const navItem = document.getElementById(id + "d");
    if (navItem) {
      navItem.classList.add("active-list-item");
    }

    setIsOpen(false); // Close sidebar on mobile after selection
  }
  const handleHeadClick = (id: string) => {
    head_click(id);
  };
  const handleContentClick = (id: string) => {
    // If it's the research interests top-level link
    content_click(id);
  };


  return (
    <aside className="overflow-auto lg:w-2/5">
      <>
        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#1A365D] text-white p-3 rounded-full shadow-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-full lg:block
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        overflow-y-auto border-r lg:border-none p-4
      `}>
          <div className="w-full p-2 text-black hide-scrollbar min-h-20 rounded-2xl cursor-pointer">
            <div
              className="vertical-list-head ui sub-heading"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleContentClick("researchinterests")}
            >
              Research Interests
            </div>
            <hr />
            <div
              className="vertical-list-head ui sub-heading"
              id="biosketch"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("biosketch")}
            >
              Biosketch
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("educationaldetails")}
                id="educationaldetailsd"
              >
                Educational Details
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("professionalbackground")}
                id="professionalbackgroundd"
              >
                Professional Background
              </div>
            </div>
            <hr />
            <div
              className="ui one-liner-captions vertical-list-head sub-heading"
              id="research"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("research")}
            >
              Research
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("projects")}
                id="projectsd"
              >
                Projects
              </div>
              <div
                className="ui one-liner-captions active-list-item"
                onClick={() => handleContentClick("publications")}
                id="publicationsd"
              >
                Publications
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("patents")}
                id="patentsd"
              >
                Patents
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("books")}
                id="booksd"
              >
                Books
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("collaborations")}
                id="collaborationsd"
              >
                Collaborations
              </div>
            </div>
            <hr />
            <div
              className="vertical-list-head ui sub-heading"
              id="honoursandawards"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("honoursandawards")}
            >
              Honours and Awards
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("honors")}
                id="honorsd"
              >
                Honors
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("memberships")}
                id="membershipsd"
              >
                Memberships
              </div>
            </div>
            <hr />
            <div
              className="vertical-list-head ui sub-heading"
              id="teachingengagements"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("teachingengagements")}
            >
              Teaching Engagements
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("teachingengagements")}
                id="teachingengagementsd"
              >
                Teaching Engagements
              </div>
            </div>
            <hr />
            <div
              className="vertical-list-head ui sub-heading"
              id="students"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("students")}
            >
              Students
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("supervisions")}
                id="supervisionsd"
              >
                Supervisions
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("associatescholars")}
                id="associatescholarsd"
              >
                Associate Scholars
              </div>
            </div>
            <hr />
            <div
              className="vertical-list-head ui sub-heading"
              id="miscellaneous"
              style={{ fontSize: "20px", color: "blue", padding: "0.35rem" }}
              onClick={() => handleHeadClick("miscellaneous")}
            >
              Miscellaneous
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("events")}
                id="eventsd"
              >
                Events
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("visits")}
                id="visitsd"
              >
                Visits
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("administrativepositions")}
                id="administrativepositionsd"
              >
                Administrative Positions{" "}
              </div>
              <div
                className="ui one-liner-captions"
                onClick={() => handleContentClick("miscellaneous")}
                id="miscellaneousd"
              >
                Miscellaneous
              </div>
            </div>
          </div>
        </aside>
      </>
    </aside>
  );
};

export default ProfileNav;
