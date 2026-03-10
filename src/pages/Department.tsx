import Header from '../components/Header'
import Showcase from '../components/Showcase'
import Footer from '../components/Footer'

const Department = (props: any) => {
  return (
    <div>
      <Header />
      <div className="w-full bg-[#1A365D] min-h-2/5 text-blue-50" style={{ "padding": "3vw 10vw" }}>
        <a href="/" className='text-sm'>Departments &gt; {props.department}</a>

        <h1 className='text-xl mt-16 mb-8'>DEPARTMENTS IGU</h1>
        <p className='text-[#cfdbe6] text-sm '>IIT Roorkee is one of the biggest technical institutions in the country having the largest number of academic units. It has 23 academic departments covering engineering, architecture and planning, humanities & social sciences, and management programmes, 1 school, 9 academic centres, 7 centers of excellence, 7 academic service centres and 6 supporting units.</p>

      </div>
      <Showcase />
      <Footer />
    </div>
  )
}

export default Department