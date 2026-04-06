import Header from '../components/Header'
import Showcase from '../components/Showcase'
import Footer from '../components/Footer'

const Department = (props: any) => {
  return (
    <div className='min-h-dvh'>
      <Header />
      <div className="w-full bg-[#1A365D] min-h-2/5 text-blue-50" style={{ "padding": "3vw 10vw" }}>
        <h1 className='text-xl mt-10 mb-8'><a href="/" className='text-sm'>Faculty &rarr; {props.department}</a></h1>
        <p className='text-[#cfdbe6] mt-8 text-sm '>Indira Gandhi University Meerpur, Rewari was established on September 07, 2013. The University is committed to work vigorously for the all-round personality development of students by making them not just outstanding professionals but also good individuals with ingrained human values. The university campus is situated in village Meerpur at a distance of about 10 Km from district headquarter of Rewari, and is about 300 kms from Chandigarh, the State Capital. It is well connected both by rail as well as road. Spread over about 100 acres of land in lush green area and is well laid with state-of-the-art buildings. Before coming into existence as an independent State University it was working as Indira Gandhi Post Graduate Regional Centre of Maharishi Dayanand University, Rohtak which was established on 3rd October, 1988.</p>

      </div>
      <Showcase />
      <Footer />
    </div>
  )
}

export default Department