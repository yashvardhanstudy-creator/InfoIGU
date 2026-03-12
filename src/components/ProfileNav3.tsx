
const ProfileNav = () => {

    const url = window.location.href.split('#')[0]

    const vertical_list_nest = document.getElementsByClassName('one-liner-captions')

    const list_sub_heading = document.getElementsByClassName('sub-heading')
    for (let i = 0; i < vertical_list_nest.length; i++) {
        var id = vertical_list_nest[i].innerHTML.toLowerCase()
        vertical_list_nest[i].setAttribute('id', id.replace(/\s/g, '') + 'd')
    }

    for (let i = 0; i < list_sub_heading.length; i++) {
        var id = list_sub_heading[i].innerHTML.toLowerCase()
        list_sub_heading[i].setAttribute('id', id.replace(/\s/g, ''))
    }

   
    function head_click(id: any) {
    const element = document.getElementById(id);
    if (!element) return;

    let sub_heading = element.nextElementSibling as HTMLElement | null;

    if (sub_heading && sub_heading.tagName === "HR") {
        sub_heading = sub_heading.nextElementSibling as HTMLElement | null;
    }

    if (!sub_heading) return;

    if (sub_heading.style.display === 'none' || sub_heading.style.display === '') {
        sub_heading.style.display = 'block';
    } else {
        sub_heading.style.display = 'none';
    }
}

  function content_click(id: any) {
    const active_item = document.getElementsByClassName('active-list-item')

    if (active_item.length !== 0) {
        active_item[0].classList.remove("active-list-item")
    }

    const new_active_item = document.getElementById(id)
    if (!new_active_item) return;

    new_active_item.classList.add("active-list-item")
   const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: "smooth" });
    }
}
    const handleHeadClick = (id: string) => {
        head_click(id);
    };
    const handleContentClick = (id: string) => {
        content_click(id);
    };

    return (
        <aside className="overflow-auto">

            <div className="vertical-list" style={{ fontSize: '18px' }}>
                <div className="vertical-list-head ui sub-heading" id="researchinterests" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem'  }} onClick={() => handleContentClick('researchinterests')}>Research Interests</div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="biosketch" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('biosketch')}>Biosketch</div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions"onClick={() => handleContentClick('educationaldetails')} id="educationaldetails">Educational
                        Details</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('professionalbackground')} id="professionalbackground">Professional
                        Background</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="research" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('research')}>Research</div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('projects')} id="projects">Projects</div>
                    <div className="ui one-liner-captions active-list-item" onClick={() => handleContentClick('publications')} id="publications">Publications</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('patents')} id="patents">Patents</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('books')} id="books">Books</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('collaborations')} id="collaborations">Collaborations</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="honoursandawards" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('honoursandawards')}>Honours and Awards
                </div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('honors')} id="honors">Honors</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('memberships')} id="memberships">Memberships</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="teachingengagements" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('teachingengagements')}>Teaching Engagements
                </div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('teachingengagements')} id="teachingengagements">Teaching
                        Engagements</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="students" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('students')}>Students</div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('supervisions')} id="supervisions">Supervisions</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('associatescholars')} id="associatescholars">Associate
                        Scholars</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="miscellaneous" style={{ fontSize: '20px',  color: 'blue',padding: '0.35rem' }} onClick={() => handleHeadClick('miscellaneous')}>Miscellaneous</div>
                <div className="vertical-list-nest" style={{ display: 'block', marginLeft: '8px' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('events')} id="events">Events</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('visits')} id="visits">Visits</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('administrativepositions')} id="administrativepositions">Administrative
                        Positions </div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('miscellaneous')} id="miscellaneous">Miscellaneous</div>
                </div>
            </div>
        </aside>

    )
}

export default ProfileNav