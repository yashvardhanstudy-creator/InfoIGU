import Button from '@mui/material/Button'
import * as constants from './constants'

export const routes = {
  users: '/users',
  categories: '/categories',
  articles: '/articles',
  contact: '/contact',
}

export interface UserProfile {
  id: number
  name: string
  research_interests: string
  work: string
  avatar: string
  email: string
  phone: string
  department: string
}

type ProfileCardProps = {
  user: UserProfile
}

const ProfileCard = ({ user }: ProfileCardProps) => {

  console.log(user);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Not Button */}
      <div className="p-5 h-4/5">

        <div className="mb-4 flex flex-col items-center md:flex-row ">

          {/* avatar */}
          <div className="w-fill max-w-28 h-auto">
            <img
              src={`${constants.SERVER_URL}${user.name}_${user.department}.png`}
              onError={(e) => { e.currentTarget.src = constants.PROFILE_PIC_URL; }}
              alt={user.name}
              className="size-32 md:size-24 lg:size-32 rounded-full object-cover"
            />
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
              <img src={constants.DEPARTMENT_SVG} className="size-5" alt="Contact" />
              <span className="font-semibold text-[#0067B3]">{user.department}</span>
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <img src={constants.EMAIL_SVG} className="size-5" alt="Contact" />
              <span className="font-semibold text-[#0067B3]">{user.email}</span>
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <img src={constants.PHONE_SVG} className="size-5" alt="Contact" />
              <span className="font-semibold text-[#0067B3]">{user.phone}</span>
            </span>
          </div>
        </div>

        {/* description */}
        {user.research_interests && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-[#1A365D] uppercase tracking-wider mb-1 block">Research Interests</span>
            <p title={user.research_interests} className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
              {user.research_interests}
            </p>
          </div>
        )}
      </div>

      {/* button */}
      <div className="border-t border-gray-100 bg-gray-50 py-2 flex justify-center">
        <Button
          style={{
            width: '75%',
          }}
          variant='contained'
          href={`/profile/${encodeURIComponent(user.name)}`}

        >
          View Profile
        </Button>
      </div>
    </div>
  )
};

export default ProfileCard