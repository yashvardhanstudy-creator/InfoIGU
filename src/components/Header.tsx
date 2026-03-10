

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <nav>

        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-yellow-300">Indira Gandhi University</a></li>
        </ul>
      </nav>
      <h1 className='text-yellow-300'>My App</h1>

    </header>
  )
}

export default Header