import * as React from "react";
import { Menu, X } from "lucide-react";

const ProfileNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            // Remove active class from all links
            document.querySelectorAll('.one-liner-captions.active-list-item').forEach(item => {
              item.classList.remove('active-list-item');
            });
            // Add active class to the corresponding link
            const navLink = document.getElementById(`${id}d`);
            if (navLink) {
              navLink.classList.add('active-list-item');
            }
          }
        });
      },
      {
        // This creates a horizontal line 25% from the top of the viewport.
        // When a section header crosses this line, it becomes active.
        rootMargin: "-25% 0px -75% 0px",
        threshold: 0,
      }
    );

    const sectionIds = [
      "researchinterests", "educationaldetails", "professionalbackground",
      "projects", "publications", "patents", "books", "collaborations",
      "honors", "memberships", "teachingengagements", "supervisions",
      "associatescholars", "events", "visits", "administrativepositions",
      "miscellaneous",
    ];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array ensures this runs only once on mount

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
          <div className="w-full p-4 text-black hide-scrollbar min-h-20 rounded-2xl cursor-pointer shadow-sm border border-gray-100 bg-white">
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="researchinterests-head"
              onClick={() => handleContentClick("researchinterests")}
            >
              Research Interests
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="biosketch-head"
              onClick={() => handleHeadClick("biosketch-head")}
            >
              Biosketch
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("educationaldetails")}
                id="educationaldetailsd"
              >
                Educational Details
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("professionalbackground")}
                id="professionalbackgroundd"
              >
                Professional Background
              </div>
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="ui one-liner-captions vertical-list-head sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="research-head"
              onClick={() => handleHeadClick("research-head")}
            >
              Research
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("projects")}
                id="projectsd"
              >
                Projects
              </div>
              <div
                className="ui one-liner-captions active-list-item text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("publications")}
                id="publicationsd"
              >
                Publications
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("patents")}
                id="patentsd"
              >
                Patents
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("books")}
                id="booksd"
              >
                Books
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("collaborations")}
                id="collaborationsd"
              >
                Collaborations
              </div>
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="honoursandawards-head"
              onClick={() => handleHeadClick("honoursandawards-head")}
            >
              Honours and Awards
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("honors")}
                id="honorsd"
              >
                Honors
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("memberships")}
                id="membershipsd"
              >
                Memberships
              </div>
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="teachingengagements-head"
              onClick={() => handleHeadClick("teachingengagements-head")}
            >
              Teaching Engagements
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("teachingengagements")}
                id="teachingengagementsd"
              >
                Teaching Engagements
              </div>
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="students-head"
              onClick={() => handleHeadClick("students-head")}
            >
              Students
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("supervisions")}
                id="supervisionsd"
              >
                Supervisions
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("associatescholars")}
                id="associatescholarsd"
              >
                Associate Scholars
              </div>
            </div>
            <hr className="my-2 border-gray-100" />
            <div
              className="vertical-list-head ui sub-heading text-lg font-bold text-[#1A365D] py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              id="miscellaneous-head"
              onClick={() => handleHeadClick("miscellaneous-head")}
            >
              Miscellaneous
            </div>
            <div
              className="vertical-list-nest"
              style={{ display: "block", marginLeft: "8px" }}
            >
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("events")}
                id="eventsd"
              >
                Events
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("visits")}
                id="visitsd"
              >
                Visits
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
                onClick={() => handleContentClick("administrativepositions")}
                id="administrativepositionsd"
              >
                Administrative Positions{" "}
              </div>
              <div
                className="ui one-liner-captions text-gray-600 hover:text-[#1A365D] hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
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
