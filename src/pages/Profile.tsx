
const Profile = () => {
    const data = { name: "Pooja" }
    return (
        <>
            <div className="w-4/5 bg-[#1A365D] min-h-2/5 text-blue-50 bg-center mt-4 m-auto rounded-2xl" style={{ "padding": "3vw 10vw" }}>
                <a href="/" className='text-sm underline underline-offset-2 hover:text-blue-400 transition-all duration-300'>Department</a>  &gt;

                <h1 className='text-xl mt-16 mb-8'>{data.name}</h1>
                <p className='text-[#cfdbe6] text-sm '>IIT Roorkee is one of the biggest technical institutions in the country having the largest number of academic units. It has 23 academic departments covering engineering, architecture and planning, humanities & social sciences, and management programmes, 1 school, 9 academic centres, 7 centers of excellence, 7 academic service centres and 6 supporting units.</p>

            </div>
            <div>Profile</div>
        </>
    )
}

export default Profile