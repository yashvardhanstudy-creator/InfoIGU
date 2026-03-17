import { Button } from "@mui/material"


const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <nav>

        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-yellow-300">Indira Gandhi University</a></li>
        </ul>
      </nav>
      <Button className='text-yellow-300' variant="contained" onClick={() => { window.location.href = "/auth" }}>Edit Your Profile</Button>

    </header>
  )
}

export default Header