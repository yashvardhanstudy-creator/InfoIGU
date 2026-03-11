import * as constants from './constants'

const ProfileHero = () => {
    const data = { name: "Pooja" }

    return (
        <div className="flex w-4/5 bg-[#1A365D] min-h-2/5 text-blue-50 mt-4 m-auto rounded-2xl" style={{ "padding": "2vh 5vw" }}>
            <div className="w-2/5 m-auto">
                <img className="rounded-2xl shadow-2xl w-3/5 m-auto" src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile Pic" />
            </div>
            <div className="w-3/5 flex flex-col justify-between gap-3 align-middle ">
                <button className="place-items-end border-[#0067B3]  border-2 w-2/5 self-end rounded-xl hover:bg-[#ccefff] hover:text-[#353434] transistion duration-200 p-1 font-bold">Download Resume</button>
                <div>
                    <h1 className='text-3xl font-extrabold '>{data.name}</h1>
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

    )
}

export default ProfileHero