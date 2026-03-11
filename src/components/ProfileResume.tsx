import ShowProfession from './ShowProfession'
import ShowData from './ShowData'

const ProfileResume = (props: any) => {
    const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4"
    const titleStyleh3 = "text-xl  mb-4"
    return (
        <div className='w-3/5 bg-[#f0f0f0] p-2 text-black hide-scrollbar min-h-20  rounded-2xl overflow-y-auto '>

            {props.researchinterests && (
                <>
                    <h2 className={titleStyleh2} id='researchinterests'>RESEARCH INTERESTS</h2>
                    <p>{props.researchinterests}</p>
                </>
            )}

            {props.biosketch && (
                <>
                    <h2 className={titleStyleh2}>BIO SKETCH</h2>
                    <h3 className={titleStyleh3} >Educational Details</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3}>Proffessional Background</h3>
                    <ShowProfession />
                </>
            )}
            {props.research && (
                <>
                    <h2 className={titleStyleh2}>RESEARCH</h2>
                    <h3 className={titleStyleh3}>Projects</h3>
                    <ShowData />
                    <h3 className={titleStyleh3}>Publications</h3>
                    <ShowData />
                    <h3 className={titleStyleh3}>Patents</h3>
                    <ShowData />
                    <h3 className={titleStyleh3}>Books</h3>
                    <ShowData />
                    <h3 className={titleStyleh3}>Collaborations</h3>
                    <ShowData />
                </>
            )}
            {props.honors && (
                <>
                    <h2 className={titleStyleh2}>HONORS & AWARDS</h2>
                    <h3 className={titleStyleh3}>Honors</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3}>Memberships</h3>
                    <ShowProfession />
                </>
            )}
            {props.students && (
                <>
                    <h2 className={titleStyleh2}>STUDENTS</h2>
                    <h3 className={titleStyleh3}>Supervisions</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3}>Associate Scholars</h3>
                    <ShowProfession />
                </>
            )}
            {props.miscellaneous && (
                <>
                    <h2 className={titleStyleh2}>MISCELLANEOUS</h2>
                    <h3 className={titleStyleh3}>Supervisions</h3>
                    <ShowProfession />
                    <h3 className={titleStyleh3}>Associate Scholars</h3>
                    <ShowProfession />
                </>
            )}


        </div>
    )
}

export default ProfileResume