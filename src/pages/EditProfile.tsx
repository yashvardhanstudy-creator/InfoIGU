import * as constants from '../components/constants'
import ShowData from '../components/ShowData'
import ShowProfession from '../components/ShowProfession'


const EditProfile = (props: any) => {
    const titleStyleh2 = "text-2xl text-[#0067B3] mt-2 mb-4"
    const titleStyleh3 = "text-xl  mb-4"
    const data = {
        name: 'Pooja'
    }
    return (
        <>
            <div className="flex w-4/5 bg-[#1A365D] min-h-2/5 text-white m-auto rounded-b-2xl" style={{ "padding": "2vh 5vw" }}>
                <div className="w-2/5 m-auto">
                    <img className="rounded-2xl shadow-2xl w-3/5 m-auto " src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile Pic" />
                </div>
                <div className="w-3/5 flex flex-col justify-between gap-3 align-middle ">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" className='ml-2' value={data.name} name='name' />
                        <div className='place-items-end lg:w-1/4 sm:w-2/5'>
                            <p className='mb-4'> - Assistant Professor</p>
                        </div>
                    </div>
                    <div>
                        <span className='flex items-center gap-2'>
                            <img className="w-4" src={constants.DEPARTMENT_SVG_WHITE} alt="Department: " />
                            Hello
                        </span>
                        <span className='flex items-center gap-2'>
                            <img className="w-4" src={constants.EMAIL_SVG_WHITE} alt="E-Mail: " />
                            Hello
                        </span>
                        <span className='flex items-center gap-2'>
                            <img className="w-4" src={constants.PHONE_SVG_WHITE} alt="Phone: " />
                            Hello
                        </span>
                    </div>
                    <p className='text-[#cfdbe6] text-sm '></p>
                </div>

            </div>
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
        </>
    )
}

export default EditProfile