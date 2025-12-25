import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();
export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const {user} = useUser()
  const {getToken} = useAuth()

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null)
  const [companyData, setCompanyData] = useState(null)

  const [userData,setUserData] = useState(null)
  const [userApplications,setUserApplications] = useState(null)


  // Function to fetch jobs
  const fetchjobs = async () => {
    try {
      

      const {data} = await axios.get(backendUrl + '/api/jobs')

      if (data.success) {
        setJobs(data.jobs)
        
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {

      const {data} = await axios.get(backendUrl + '/api/company/company',{headers:{token:companyToken}})

      if (data.success) {
        setCompanyData(data.company)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to fetch user data
  const fetcUserData = async () =>{
    try {
      const token = await getToken()
      console.log("Token from Clerk:", token);
      // const {data} = await axios.get(backendUrl + '/api/users/user',{headers:{Authorization:`Bearer ${token}`}})

      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
  headers: { Authorization: `Bearer ${token}` },
});
// console.log("Backend response:", data);


      if (data.success) {
        setUserData(data.user)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchjobs();

    const storedCompanyToken = localStorage.getItem('companyToken')

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken)
    }
  },[]);


  useEffect(()=>{
if (companyToken){
  fetchCompanyData()
}
  },[companyToken])

  useEffect(()=>{
    if (user) {
      fetcUserData()
    }
  },[user])

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,setCompanyToken,
    companyData,setCompanyData,
    backendUrl,userData,setUserData,userApplications,setUserApplications
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};



export default AppContextProvider;
