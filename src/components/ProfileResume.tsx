import ShowProfession from './ShowProfession'
import ShowData from './ShowData'

const ProfileResume = (props: any) => {
    const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4"
    const titleStyleh3 = "text-xl  mb-4"
    return (
        <div className='w-4/5 bg-[#f0f0f0] p-2  text-black hide-scrollbar min-h-20  rounded-2xl overflow-y-auto '>

            {props.researchinterests && (
                <>
                    <h2 className={titleStyleh2} id='researchinterests'>RESEARCH INTERESTS</h2>
                    <p>{props.researchinterests}</p>
                </>
            )}

            {props.biosketch && (
                <>
                    <h2 className={titleStyleh2} id="biosketch">BIO SKETCH</h2>
                    <h3 className={titleStyleh3} id="educationaldetails">Educational Details</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="professionalbackground">Professional Background</h3>
                    <ShowProfession />
                </>
            )}
            {props.research && (
                <>
                    <h2 className={titleStyleh2} id="research">RESEARCH</h2>
                    <h3 className={titleStyleh3} id="projects">Projects</h3>
                    <ShowData />
                    <h3 className={titleStyleh3} id="publications">Publications</h3>
                    <ShowData />
                    <h3 className={titleStyleh3} id="patents">Patents</h3>
                    <ShowData />
                    <h3 className={titleStyleh3} id="books">Books</h3>
                    <ShowData />
                    <h3 className={titleStyleh3} id="collaborations">Collaborations</h3>
                    <ShowData />
                </>
            )}
            {props.honors && (
                <>
                    <h2 className={titleStyleh2} id="honoursandawards">HONORS & AWARDS</h2>
                    <h3 className={titleStyleh3} id="honors">Honors</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="memberships">Memberships</h3>
                    <ShowProfession />
                </>
            )}
            {props.students && (
                <>
                    <h2 className={titleStyleh2} id="students">STUDENTS</h2>
                    <h3 className={titleStyleh3} id="supervisions">Supervisions</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="associatescholars">Associate Scholars</h3>
                    <ShowProfession />
                </>
            )}
            {props.miscellaneous && (
                <>
                    <h2 className={titleStyleh2} id="miscellaneous">MISCELLANEOUS</h2>
                    <h3 className={titleStyleh3} id="events">Events</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="visits">Visits</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="administrativepositions">Administrative Positions</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3} id="miscellaneous">Miscellaneous</h3>
                    <ShowProfession />
                </>
            )}


        </div>
    )
}

export default ProfileResume