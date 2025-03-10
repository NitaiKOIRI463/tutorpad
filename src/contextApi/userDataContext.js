import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/config.js";
import { useNavigate } from "react-router-dom";

const userDataContext = createContext();

export const useUserDataContext = () => useContext(userDataContext);
const token = JSON.parse(localStorage.getItem("tutorPad"));

const AppContext = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState("");
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [emailTemplateData, setEmailTemplateData] = useState([]);
  const [emailOnchange, setEmailOnchange] = useState(false);
  const [studentData, setStudentData] = useState(false);
  const [tutorData, setTutorData] =useState(false);
  const [allTutors, setAllTutors] = useState([]);
  const [getAvailabilityData, setGetAvailabilityData] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [emailData, setEmailData] = useState({
    template_title: "",
    template_content: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async (token) => {
    setLoading(true);
    const validateconfig = {
      method: "GET",
      url: `${API_URL}tenant/details`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          setLoading(false);
          setUserData(response.data.data);
          setUserId(response.data.id);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(true);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("tutorPad");
    setTimeout(() => {
      navigate("/signin");
      setLoading(false);
    }, 1000);
  };

  // Email Template start
  const emailTemplate = async () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("tutorPad"));
    const validateconfig = {
      method: "GET",
      url: `${API_URL}ets`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success === true) {
          setLoading(false);
          setEmailTemplateData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleEmailTemplate = async (e) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("tutorPad"));
    if (e.target.value === 0) {
      setEmailOnchange(false);
    } else {
      setEmailOnchange(true);
    }
    const validateconfig = {
      method: "GET",
      url: `${API_URL}et/${e.target.value}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success === true) {
          setLoading(false);
          setEmailData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  // Email Template emd

  const fetchStudentData = async () => {
    setLoading(true);
    const validateconfig = {
      method: "GET",
      url: `${API_URL}get-students?user_id=${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success === true) {
          setLoading(false);
          setStudentData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchTutorData = async () => {
    setLoading(true);
    const validateconfig = {
      method: "GET",
      url: `${API_URL}tutors`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success === true) {
          setLoading(false);
          setTutorData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //Availability start

  const allAvailabilityData = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}get-availabilities`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          setGetAvailabilityData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Availability end

  //Tutor

  const getTutor = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}tutors`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then((response) => {
        // console.log(response);
        if (response.data.success === true) {
          setAllTutors(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Calendar Events Start

  // const fetchEvent = async () => {
  //   const config = {
  //     method: "GET",
  //     url: `${API_URL}events`,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   await axios(config)
  //     .then((response) => {
  //       console.log(response.data.data);
  //       setAllEvents(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const fetchEvent = async (startDate,endDate) => {
    const config = {
      method: "GET",
      url: `${API_URL}events?start_date=${startDate}&end_date=${endDate}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data.data);
        setAllEvents(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Calendar Events End

  // Event Category

  const fetchCategory = async () => {
    const config = {
      method: "GET",
      url: `${API_URL}eventcats`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data.data);
        setAllCategory(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <userDataContext.Provider
      value={{
        fetchData,
        userData,
        logOut,
        sidebarToggle,
        setSidebarToggle,
        emailTemplate,
        emailTemplateData,
        handleEmailTemplate,
        emailOnchange,
        emailData,
        setEmailData,
        token,
        fetchStudentData,
        studentData,
        tutorData,
        userId,
        setLoading,
        loading,
        allAvailabilityData,
        getAvailabilityData,
        allTutors,
        getTutor,
        fetchEvent,
        allEvents,
        fetchTutorData,
        fetchCategory,
        allCategory
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export default AppContext;
