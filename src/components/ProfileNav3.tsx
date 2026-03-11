
const ProfileNav = () => {

    const url = window.location.href.split('#')[0]

    const vertical_list_nest = document.getElementsByClassName('one-liner-captions')

    const list_sub_heading = document.getElementsByClassName('list-sub-heading')

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
        const sub_heading = element.nextSibling?.nextSibling as HTMLElement | null;
        if (!sub_heading || !(sub_heading instanceof HTMLElement)) return;
        const style = getComputedStyle(sub_heading);
        if (style.display == 'none') {
            sub_heading.style.display = 'block';
        }
        else {
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
        var link = url + '#' + id;
        window.location.href = link
    }
    const handleContentClick = (id: string) => {
        content_click(id);
    };

    const handleHeadClick = (id: string) => {
        head_click(id);
    };

    return (
        <aside className="overflow-auto">

            <div className="vertical-list">
                <div className="vertical-list-head ui sub-heading" id="researchinterests" onClick={() => handleContentClick('researchinterests')}>Research Interests</div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="1" onClick={() => handleHeadClick('1')}>Biosketch</div>
                <div className="vertical-list-nest" style={{ display: 'none' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('educationaldetailsd')} id="educationaldetailsd">Educational
                        Details</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('professionalbackgroundd')} id="professionalbackgroundd">Professional
                        Background</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="2" onClick={() => handleHeadClick('2')}>Research</div>
                <div className="vertical-list-nest" style={{ display: 'block' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('projectsd')} id="projectsd">Projects</div>
                    <div className="ui one-liner-captions active-list-item" onClick={() => handleContentClick('publicationsd')} id="publicationsd">Publications</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('patentsd')} id="patentsd">Patents</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('booksd')} id="booksd">Books</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('collaborationsd')} id="collaborationsd">Collaborations</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="3" onClick={() => handleHeadClick('3')}>Honours and Awards
                </div>
                <div className="vertical-list-nest" style={{ display: 'block' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('honorsd')} id="honorsd">Honors</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('membershipsd')} id="membershipsd">Memberships</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="4" onClick={() => handleHeadClick('4')}>Teaching Engagements
                </div>
                <div className="vertical-list-nest" style={{ display: 'block' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('teachingengagementsd')} id="teachingengagementsd">Teaching
                        Engagements</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="5" onClick={() => handleHeadClick('5')}>Students</div>
                <div className="vertical-list-nest" style={{ display: 'block' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('supervisionsd')} id="supervisionsd">Supervisions</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('associatescholarsd')} id="associatescholarsd">Associate
                        Scholars</div>
                </div>
                <hr />
                <div className="vertical-list-head ui sub-heading" id="6" onClick={() => handleHeadClick('6')}>Miscellaneous</div>
                <div className="vertical-list-nest" style={{ display: 'block' }}>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('eventsd')} id="eventsd">Events</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('visitsd')} id="visitsd">Visits</div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('administrativepositionsd')} id="administrativepositionsd">Administrative
                        Positions
                    </div>
                    <div className="ui one-liner-captions" onClick={() => handleContentClick('miscellaneousd')} id="miscellaneousd">Miscellaneous</div>
                </div>
            </div>
        </aside>

    )
}

export default ProfileNav