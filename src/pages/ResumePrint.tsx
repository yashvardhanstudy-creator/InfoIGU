import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileResume from "../components/ProfileResume";
import * as constants from "../components/constants";

const ResumePrint = () => {
    const { name } = useParams();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!name) return;
            try {
                const response = await fetch(`http://localhost:5000/api/profiles/profile/${name}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setUserData(data[0]);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [name]);

    useEffect(() => {
        if (!loading && userData) {
            // Add a slight delay to allow table child components to fetch and render their respective data
            setTimeout(() => {
                window.print();
            }, 1500);
        }
    }, [loading, userData]);

    if (loading) return <div className="text-center mt-10 text-[#1A365D] font-bold">Generating Resume...</div>;
    if (!userData) return <div className="text-center mt-10 text-red-500 font-bold">Profile not found.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white text-black min-h-screen">
            <style>
                {`
                    @page {
                        margin: 1.5cm; /* Helps prevent the browser from printing its default Date and URL headers/footers */
                    }
                    @media print {
                        * {
                            box-shadow: none !important;
                            transition: none !important;
                        }
                        /* Strip blue link formatting and prevent clicking in generated PDFs */
                        a {
                            color: inherit !important;
                            text-decoration: none !important;
                            pointer-events: none !important;
                        }
                        .MuiTableContainer-root {
                            overflow: visible !important;
                        }
                        .MuiPaper-root {
                            box-shadow: none !important;
                        }
                        /* Show full title instead of truncating in print */
                        .truncate {
                            white-space: normal !important;
                            overflow: visible !important;
                            text-overflow: clip !important;
                        }
                        .max-w-50 {
                            max-width: none !important;
                        }
                    }
                `}
            </style>
            {/* Clean header for print */}
            <div className="flex items-center gap-6 border-b-2 border-gray-300 pb-6 mb-6">
                <img
                    src={`${constants.SERVER_URL}${userData.name}_${userData.department}.png`}
                    onError={(e) => { e.currentTarget.src = constants.PROFILE_PIC_URL; }}
                    alt={userData.name}
                    className="w-32 h-32 rounded-full object-cover print:w-24 print:h-24"
                />
                <div>
                    <h1 className="text-4xl font-bold text-[#1A365D]">{userData.name}</h1>
                    <p className="text-xl text-gray-700 mt-1">{userData.designation}</p>
                    <p className="text-gray-600">{userData.department}</p>
                    <div className="mt-2 text-sm text-gray-500">
                        <p>Email: {userData.email}</p>
                        <p>Phone: {userData.phone}</p>
                    </div>
                </div>
            </div>

            <ProfileResume
                researchInterests={userData.research_interests}
                name={name}
                id={userData.id}
                editMode={false}
                isPrint={true}
            />
        </div>
    );
};

export default ResumePrint;