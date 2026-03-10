export const routes = {
  users: '/users',
  categories: '/categories',
  articles: '/articles',
  contact: '/contact',
}

export interface UserProfile {
  id: number
  name: string
  researchInterest: string
  work: string
  avatar: string
  email: string
  phone: string
  department: string
}

type ProfileCardProps = {
  user: UserProfile
}

const ProfileCard = ({ user }: ProfileCardProps) => (
  <div className="overflow-hidden rounded-xl border border-green-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    {/* Not Button */}
    <div className="p-5 h-4/5">

      <div className="mb-4 flex flex-col items-center md:flex-row ">

        {/* avatar */}
        <div className="w-auto max-w-28 m-auto rounded-full text-[#9b87f5]">
          <img src={user.avatar} alt={user.name} className="rounded-full object-cover" />
        </div>

        {/* info */}
        <div className="mt-3 flex flex-col gap-2 md:ml-3 md:mt-0">
          <div className="flex flex-col">
            <a href="javascript:void(0)">
              <h6 className="text-lg font-semibold">{user.name}</h6>
            </a>
            <span className="text-sm text-gray-500">{user.work}</span>
          </div>

          <span className="text-sm text-gray-500 flex items-center gap-2">
            <img src="https://www.svgrepo.com/show/430111/address-pin-location.svg" className="size-5" alt="Contact" />
            <span className="font-semibold text-[#9b87f5]">{user.department}</span>
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <img src="https://www.svgrepo.com/show/430112/mail-communication-sign.svg" className="size-5" alt="Contact" />
            <span className="font-semibold text-[#9b87f5]">{user.email}</span>
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <img src="https://www.svgrepo.com/show/430122/call-contact-phone.svg" className="size-5" alt="Contact" />
            <span className="font-semibold text-[#9b87f5]">{user.phone}</span>
          </span>
        </div>
      </div>

      {/* description */}
      <p title={user.researchInterest} className="mb-4 line-clamp-3 text-gray-600">
        {user.researchInterest}
      </p>
    </div>

    {/* button */}
    <div className="border-t border-t-green-100 bg-gray-50 p-4">
      <a
        href="/profile"
        className="block w-full rounded-lg bg-[#9b87f5] p-1 text-center text-white transition-all duration-300 hover:bg-purple-500"
      >
        View Profile
      </a>
    </div>
  </div>
)

export default ProfileCard