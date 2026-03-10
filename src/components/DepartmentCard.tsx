


export interface DepartmentProfile {
  id: number
  name: string
  avatar: string
}

type DepartmentCardProps = {
  department: DepartmentProfile
}




const DepartmentCard = ({ department }: DepartmentCardProps) => {
  return (
    <div className="bg-white rounded-lg text-[#2D3748] shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {department.avatar && (
        <img
          src={department.avatar}
          alt={department.name}
          className="w-full h-3/5 object-cover"
        />
      )}
      <div className="p-3 flex h-2/5 flex-col justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{department.name}</h2>
        <div className="mt-4 place-items-end">
          <a
            href={"/" + department.name.toLowerCase().replace(/\s+/, "")}
            className="block w-1/2 rounded-lg hover:text-[#ffc760] hover:bg-white hover:underline p-1 text-center text-white transition-all duration-300 bg-[#3182CE]"
          >
            View Department
          </a>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
