import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MiniSidebar from "../../../sidebar/MiniSidebar.js";
import Sidebar from "../../../sidebar/Sidebar.js";
import TopBar from "../../../sidebar/TopBar.js";
import "./assets/css/style.css";
import { useUserDataContext } from "../../../../contextApi/userDataContext.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../utils/config.js";
import instructors from "../../assets/images/Instructors.svg";
import students from "../../assets/images/students.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FetchStudyLog from "../FetchStudyLog.js";
import FetchAttendanceLog from "../FetchAttendanceLog.js";
import lending from "../assets/images/lending.svg";
import ReactModal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import payroll from "../../assets/images/payroll.svg";
import attendance from "../assets/images/attendance.svg";
import Select from "react-select";

const TutorEditDetails = () => {
  const {
    sidebarToggle,
    token,
    setLoading,
    userData,
    userId,
    fetchData,
    getAvailabilityData,
    allAvailabilityData,
    studentData,
    fetchStudentData,
    fetchCategory,
    allCategory,
  } = useUserDataContext();
  const [initial, setInitial] = useState("");
  const [todayDate, setTodayDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [tutorFetchData, setTutorFetchData] = useState({});
  const [attendFlag, setAttendFlag] = useState(false);
  const [modalIsOpen, setIsOpens] = useState(false);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({});
  const [availFlag, setAvailFlag] = useState(false);
  const [availData, setAvailData] = useState({});
  const [attendDisabled, setAttenddisabled] = useState(true);
  const [emailDisabled, setEmaildisabled] = useState(true);
  const [tenantData, setTenantData] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState({});
  const [days, setDays] = useState({});
  const [editA, setEditA] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [editPrivileges, setEditPrivileges] = useState(false);
  const [checkedPrivileges, setCheckedPrivileges] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [defaultLessonCat, setDefaultLessonCat] = useState("");
  const [defaultLessonLength, setDefaultLessonLength] = useState("30");
  const [price, setPrice] = useState("30.00");
  const [makeUpCredits, setMakeUpCredits] = useState("0");
  const [assignStudent, setAssignStudent] = useState({});

  let { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleStudentsChange = (selectedOptions) => {
    setSelectedStudents(selectedOptions);
  };

  const handleEditClick = () => {
    setEditPrivileges((prev) => !prev);
  };

  const handleCancelClick = () => {
    setEditPrivileges(false);
  };

  const fetchTutorDetails = async (id) => {
    setLoading(true);
    console.log(id);
    const validateconfig = {
      method: "GET",
      url: `${API_URL}tutor/details/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_id: id,
      },
    };
    await axios(validateconfig)
      .then((response) => {
        console.log(response.data);
        setTutorFetchData(response.data.data);
        // Parse the privileges string to convert it into an array
        const privilegesArray = JSON.parse(response.data.data.privileges);
        setCheckedPrivileges(privilegesArray);
        setLoading(false);
        console.log(privilegesArray);
      })
      .catch((error) => {
        console.log(error);
        setLoading(true);
      });
  };

  useEffect(() => {
    fetchTutorDetails(id);
    allAvailabilityData();
    fetchStudentData();
    fetchCategory();
  }, [id]);

  useEffect(() => {
    var name = `${tutorFetchData.first_name}${" "}${tutorFetchData.last_name}`;

    var parts = name.split(" ");
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0];
      }
    }
    setInitial(initials);
    let today = new Date();
    let date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();
    setStartDate(date);
    formData.first_name = tutorFetchData?.first_name;
    formData.last_name = tutorFetchData?.last_name;
    formData.email = tutorFetchData?.email;
    formData.phone = tutorFetchData?.phone;
    formData.title = tutorFetchData?.business_data?.business_name;
    tenantData.address = tutorFetchData?.business_data?.address;
    tenantData.virtual_meeting = tutorFetchData?.business_data?.virtual_meeting;
    tenantData.subjects = tutorFetchData?.business_data?.subjects;
    tenantData.overdue_attendence =
      tutorFetchData?.business_data?.overdue_attendence;
    tenantData.default_notes_view =
      tutorFetchData?.business_data?.default_notes_view;
    tenantData.copy_recent_event =
      tutorFetchData?.business_data?.copy_recent_event;
    tenantData.automatically_copy_lesson =
      tutorFetchData?.business_data?.automatically_copy_lesson;
    tenantData.student_register_lesson =
      tutorFetchData?.business_data?.student_register_lesson;
    tenantData.student_cancel_lesson =
      tutorFetchData?.business_data?.student_cancel_lesson;
    tenantData.parent_student_signup =
      tutorFetchData?.business_data?.parent_student_signup;
    tenantData.parent_student_disable_email_reminder =
      tutorFetchData?.business_data?.parent_student_disable_email_reminder;
    tenantData.allow_student_email_studylog =
      tutorFetchData?.business_data?.allow_student_email_studylog;
    tenantData.daily_agenda = userData?.business_data?.daily_agenda;
  }, [tutorFetchData]);

  const handleChange = async (e) => {
    const name = e.target.name;
    let value = e.target.value;
    // console.log(name, value);
    if (
      name === "title" ||
      name === "first_name" ||
      name === "last_name" ||
      name === "email" ||
      name === "phone"
    ) {
      setFormData({ ...formData, [name]: value });
    } else {
      if (
        name === "overdue_attendence" ||
        name === "automatically_copy_lesson" ||
        name === "student_register_lesson" ||
        name === "student_cancel_lesson" ||
        name === "parent_student_disable_email_reminder" ||
        name === "allow_student_email_studylog" ||
        name === "parent_student_signup"
      ) {
        if (e.target.checked) {
          value = "true";
        } else {
          value = null;
        }
      }
      setTenantData({ ...tenantData, [name]: value });
    }

    if (name === "file") {
      setProfilePhoto(e.target.files[0]);
      // console.log(e.target.files[0]);
      profilePhoto["file"] = e.target.files[0];
      profilePhoto["user_id"] = userId;
      const config = {
        method: "POST",
        url: `${API_URL}update-dp`,
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: profilePhoto,
      };
      await axios(config)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.success === false) {
            setError(error.response.data.data);
          }
        });
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (editPrivileges) {
      const updatedPrivileges = checkedPrivileges || []; // Initialize as empty array if null or undefined
      if (checked) {
        setCheckedPrivileges([...updatedPrivileges, name]);
      } else {
        setCheckedPrivileges(
          updatedPrivileges.filter((privilege) => privilege !== name)
        );
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleAttendEdit = (e) => {
    setAttendFlag(!e.target.value);
    setAttenddisabled(false);
  };

  const handleEmailEdit = (e) => {
    setAttendFlag(!e.target.value);
    setEmaildisabled(false);
  };

  const handleCancelAttendFlag = (e) => {
    setAttendFlag(false);
    setAttenddisabled(true);
    setEmaildisabled(true);
  };

  const formSubmit = async (e) => {
    formData["user_id"] = userId;
    // if (profilePhoto) {
    //   formData["photo"] = profilePhoto;
    // }
    formData["tenant_data"] = tenantData;

    console.log(formData);

    e.preventDefault();
    const config = {
      method: "PATCH",
      url: `${API_URL}savedata`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };
    await axios(config)
      .then((response) => {
        // console.log(response);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setAttendFlag(false);
        setAvailFlag(false);
        setAttenddisabled(true);
        setEmaildisabled(true);
        fetchData(token);
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAvailChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (
      name === "sun" ||
      name === "mon" ||
      name === "tue" ||
      name === "wed" ||
      name === "thu" ||
      name === "fri" ||
      name === "sat"
    ) {
      setDays({ ...days, [name]: value });
    } else {
      setAvailData({ ...availData, [name]: value });
    }
  };

  const handleAvailChangePopup = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (
      name === "sun" ||
      name === "mon" ||
      name === "tue" ||
      name === "wed" ||
      name === "thu" ||
      name === "fri" ||
      name === "sat"
    ) {
      const index = selectedDays.indexOf(value);
      if (index > -1) {
        selectedDays.splice(index, 1);
      } else {
        selectedDays.push(value);
      }
      console.log(selectedDays);

      setDays({ ...selectedDays });
    } else {
      setAvailData({ ...availData, [name]: value });
    }
  };

  const handleAssignStudent = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "default_lesson_cat") {
      setDefaultLessonCat(value);
    }

    if (name === "default_lesson_length") {
      setDefaultLessonLength(value);
    }

    if (name === "price") {
      setPrice(value);
    }

    if (name === "make_up_credits") {
      setMakeUpCredits(value);
    }

    setAssignStudent({ ...assignStudent, [name]: value });
  };

  const saveAssignStudent = async (e) => {
    e.preventDefault();

    let selectedStudent = document.getElementById("students");

    assignStudent["tutor_id"] = id;
    assignStudent["student_id"] = selectedStudent?.value;

    if (!assignStudent.hasOwnProperty("price")) {
      assignStudent["price"] = price;
    }

    if (!assignStudent.hasOwnProperty("default_lesson_cat")) {
      assignStudent["default_lesson_cat"] = defaultLessonCat;
    }

    if (!assignStudent.hasOwnProperty("make_up_credits")) {
      assignStudent["make_up_credits"] = makeUpCredits;
    }

    if (!assignStudent.hasOwnProperty("default_lesson_length")) {
      assignStudent["default_lesson_length"] = defaultLessonLength;
    }

    const config = {
      method: "POST",
      url: `${API_URL}map-tutor-student`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: assignStudent,
    };
    await axios(config)
      .then((response) => {
        console.log(response);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });

        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.success === false) {
          setError(error.response.data.data);
        }
      });
  };

  const formAvailSubmit = async () => {
    availData["user_id"] = userData.id;
    let arr = Object.values(days);
    let allday = arr.toString();
    availData["days"] = allday;

    console.log(availData);

    const config = {
      method: "POST",
      url: `${API_URL}add-availability`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: availData,
    };
    await axios(config)
      .then((response) => {
        console.log(response);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setAvailFlag(false);
        allAvailabilityData();
      })
      .catch((error) => {
        console.log(error.response.data.data);
        if (error.response.data.success === false) {
          setError(error.response.data.data);
        }
      });
  };

  const editAvailability = async (id) => {
    openModal("updateAvail");

    const config = {
      method: "GET",
      url: `${API_URL}get-availability/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then((response) => {
        console.log(response.data.data);
        setEditA(response.data.data);
        availData["start_date"] = response.data.data.start_date;
        availData["end_date"] = response.data.data.end_date;
        availData["start_time"] = response.data.data.start_time;
        availData["end_time"] = response.data.data.end_time;
        availData["note"] = response.data.data.note;
        days["days"] = JSON.parse(response.data.data.days);
        setSelectedDays(JSON.parse(response.data.data.days));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAvailability = async (id) => {
    const config = {
      method: "DELETE",
      url: `${API_URL}delete-availability/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(id);
    await axios(config)
      .then((response) => {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        allAvailabilityData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateAvailability = async (e) => {
    let arr = Object.values(days);
    let allday = arr.toString();
    availData["days"] = allday;
    availData["id"] = editA.id;
    e.preventDefault();
    // console.log(availData);
    const config = {
      method: "PATCH",
      url: `${API_URL}update-availability`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: availData,
    };
    await axios(config)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setIsOpen(false);
        closeModal();
        allAvailabilityData();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.success === false) {
          setError(error.response.data.data);
        }
      });
  };
  console.log(allCategory);

  // console.log(userData);
  const customStyles = {
    content: {
      width: "60%",
      height: "80%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      background: "#6c5a5669",
    },
  };
  const passwordStyles = {
    content: {
      width: "60%",
      height: "60%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
    },
    overlay: {
      background: "#6c5a5669",
    },
  };

  const availStyles = {
    content: {
      width: "60%",
      height: "80%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
    },
    overlay: {
      background: "#6c5a5669",
    },
  };

  // ReactModal.setAppElement("#yourAppElement");

  function openModal(e) {
    setIsOpens(e);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal(e) {
    setIsOpens(e);
  }

  console.log(modalIsOpen);
  return (
    <div className="wrapper student-details">
      {sidebarToggle ? (
        <>
          <MiniSidebar />
        </>
      ) : (
        <>
          <Sidebar />
        </>
      )}

      <div className="main bg-color">
        <TopBar />

        <ReactModal
          isOpen={modalIsOpen === "profile"}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="mypreference-modal">
            <div className="close-h">
              <h4>Edit Profile</h4>
              <button className="closeModal" onClick={closeModal}>
                X
              </button>
            </div>
            <form name="studentProfile">
              <div className="row d-flex">
                <div className="col-xl-4 col-xxl-4">
                  <div className="formbold-input-flex justify-content-center">
                    <div>
                      <label htmlFor="photo" className="formbold-form-label">
                        Photo <span>Optional</span>
                      </label>
                      <div className="initials py-3">
                        <div className="image-user">
                          <h2>{initial}</h2>
                        </div>
                      </div>
                      <input
                        type="file"
                        name="photo"
                        className="form-control b-none"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-8">
                  <div className="formbold-form-step-1 active">
                    <div className="formbold-input-flex diff">
                      <div>
                        <label htmlFor="title" className="formbold-form-label">
                          Title
                        </label>

                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="formbold-form-label"
                          id="first_name"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          className="form-control"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="formbold-form-label"
                          id="last_name"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          className="form-control"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="email"
                          className="formbold-form-label"
                          id="email"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="formbold-form-label"
                            id="phone"
                          >
                            Phone Number <span>Optional</span>
                          </label>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="formbold-input-flex diff">
                      <div>
                        <label
                          htmlFor="parentaddress"
                          className="formbold-form-label"
                        >
                          Address <span>Optional</span>
                        </label>
                        <br></br>

                        <textarea
                          name="parentaddress"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex diff">
                      <div>
                        <label
                          htmlFor="parentaddress"
                          className="formbold-form-label"
                        >
                          Virtual Meeting <span>Optional</span>
                          <br></br>
                          <span>
                            Share a link to Zoom, Google Meet, or any other
                            video conferencing application.
                          </span>
                        </label>
                        <br></br>

                        <input
                          type="text"
                          name="virtual_meeting"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex diff">
                      <div>
                        <label
                          htmlFor="subject"
                          className="formbold-form-label"
                        >
                          Subjects <span>Optional</span>
                          <br></br>
                          <span>
                            Use a semicolon or press the Enter key to separate
                            entries
                          </span>
                        </label>
                        <br></br>

                        <input
                          type="text"
                          name="subject"
                          className="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex diff">
                      <div>
                        <label
                          htmlFor="location"
                          className="formbold-form-label"
                        >
                          Preferred Location
                        </label>
                        <select
                          name="location"
                          className="form-control"
                          onChange={handleChange}
                        >
                          <option>First Available Location</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div className="formbold-form-btn-wrapper">
                  <div className="btn-end">
                    <Link className="cancel" onClick={closeModal}>
                      Cancel
                    </Link>
                    <button className="formbold-btn">Submit</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={modalIsOpen === "assignStudent"}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="mypreference-modal">
            <div className="close-h">
              <h4>Assign Student</h4>
              <button className="closeModal" onClick={closeModal}>
                X
              </button>
            </div>
            <form name="studentProfile">
              <div className="row d-flex">
                <div className="col-xl-12 col-xxl-12">
                  <div className="formbold-form-step-1 active">
                    <div className="formbold-input-flex diff">
                      <div>
                        <label
                          htmlFor="students"
                          className="formbold-form-label"
                        >
                          Student
                        </label>
                        <div>
                          {/* <Select
                            name="students"
                            options={
                              studentData &&
                              studentData.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))
                            }
                            isMulti
                            onChange={handleStudentsChange}
                            value={selectedStudents}
                          /> */}

                          <select
                            name="students"
                            className="form-control"
                            onChange={handleAssignStudent}
                            id="students"
                          >
                            {studentData &&
                              studentData.map((stu) => {
                                return (
                                  <option key={stu.id} value={stu.id}>
                                    {stu.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="default_lesson_cat"
                          className="formbold-form-label"
                        >
                          Default Lesson Category
                        </label>
                        <br></br>

                        <select
                          name="default_lesson_cat"
                          className="form-control"
                          onChange={handleAssignStudent}
                          id="default_lesson_cat"
                          value={defaultLessonCat}
                        >
                          {allCategory &&
                            allCategory.map((cat) => {
                              return (
                                <option key={cat.id} value={cat.id}>
                                  {cat.eventcat_name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="default_lesson_length"
                          className="formbold-form-label"
                          id="default_lesson_length"
                        >
                          Default Lesson Length
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="default_lesson_length"
                            className="form-control"
                            onChange={handleAssignStudent}
                            value={defaultLessonLength}
                            required
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="formbold-input-flex diff">
                      <div>
                        <div>
                          <label
                            htmlFor="default_biling"
                            className="formbold-form-label"
                          >
                            Default Billing
                          </label>
                        </div>
                        <div className="input-radio">
                          <input
                            type="radio"
                            value="Don't automatically create any calendar-generated charges"
                            name="default_biling"
                            onChange={handleAssignStudent}
                          ></input>
                          Don't automatically create any calendar-generated
                          charges
                        </div>
                        <div className="input-radio">
                          <input
                            type="radio"
                            value="Student pays based on the number of lessons taken"
                            name="default_biling"
                            onChange={handleAssignStudent}
                          ></input>
                          Student pays based on the number of lessons taken
                        </div>
                        <div className="input-radio">
                          <input
                            type="radio"
                            value="Student pays the same amount each month regardless of number of lessons"
                            name="default_biling"
                            onChange={handleAssignStudent}
                          ></input>
                          Student pays the same amount each month regardless of
                          number of lessons
                        </div>
                        <div className="input-radio">
                          <input
                            type="radio"
                            value="Student pays an hourly rate"
                            name="default_biling"
                            onChange={handleAssignStudent}
                          ></input>
                          Student pays an hourly rate
                        </div>
                        <span>
                          Charges will automatically adjust to lesson length
                        </span>
                      </div>
                    </div>

                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="price"
                          className="formbold-form-label"
                          id="price"
                        >
                          Price
                        </label>
                        <div style={{ position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            <i className="fa fa-inr" aria-hidden="true"></i>
                          </span>
                          <input
                            type="text"
                            name="price"
                            className="form-control"
                            style={{
                              paddingLeft: "25px",
                              paddingRight: "70px",
                            }}
                            onChange={handleAssignStudent}
                            value={price}
                            required
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            Per Hour
                          </span>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="make_up_credits"
                          className="formbold-form-label"
                          id="make_up_credits"
                        >
                          Make-Up Credits
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="make_up_credits"
                            className="form-control"
                            onChange={handleAssignStudent}
                            value={makeUpCredits}
                            required
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            Credits
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="formbold-input-flex diff bg-gradient p-2 rounded-2"
                      style={{
                        backgroundColor: "#8de1f2",
                        border: "1px solid #63dff7",
                      }}
                    >
                      <div className="info-sign d-flex">
                        <i class="fa fa-info-circle p-2" aria-hidden="true"></i>
                        <p>
                          Make-up credits are automatically adjusted when
                          make-up lessons are taught. Only change this value if
                          you want to override the number of credits assigned to
                          this student.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div className="formbold-form-btn-wrapper">
                  <div className="btn-end">
                    <Link className="cancel" onClick={closeModal}>
                      Cancel
                    </Link>
                    <button
                      className="formbold-btn"
                      onClick={saveAssignStudent}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ReactModal>
        <ReactModal
          isOpen={modalIsOpen === "updateAvail"}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={availStyles}
          contentLabel="Change Password"
        >
          <div className="mypreference-modal">
            <div className="close-h">
              <h4>Update Availability</h4>
              <button className="closeModal" onClick={closeModal}>
                X
              </button>
            </div>
            <form name="studentProfile">
              <div className="row d-flex">
                <div className="col-xl-12 col-xxl-12">
                  <div className="formbold-form-step-1 active">
                    <div className="formbold-input-flex diff">
                      <div>
                        <div>
                          <label htmlFor="days" className="formbold-form-label">
                            Days
                          </label>
                        </div>
                        <small style={{ color: "red" }}>
                          {error?.days?.length ? error?.days[0] : <></>}
                        </small>
                        <div className="studentStatus">
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="sun"
                              value="Sun"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Sun")
                                  ? true
                                  : false
                              }
                            />
                            Sun
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="mon"
                              value="Mon"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Mon")
                                  ? true
                                  : false
                              }
                            />
                            Mon
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="tue"
                              value="Tue"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Tue")
                                  ? true
                                  : false
                              }
                            />
                            Tue
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="wed"
                              value="Wed"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Wed")
                                  ? true
                                  : false
                              }
                            />
                            Wed
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="thu"
                              value="Thu"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Thu")
                                  ? true
                                  : false
                              }
                            />
                            Thu
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="fri"
                              value="Fri"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Fri")
                                  ? true
                                  : false
                              }
                            />
                            Fri
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              className="status"
                              name="sat"
                              value="Sat"
                              onChange={handleAvailChangePopup}
                              checked={
                                selectedDays && selectedDays.includes("Sat")
                                  ? true
                                  : false
                              }
                            />
                            Sat
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="start_date"
                          className="formbold-form-label"
                        >
                          Start Date <span>Optional</span>
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          className="form-control"
                          value={availData.start_date}
                          onChange={handleAvailChangePopup}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="end_date"
                          className="formbold-form-label"
                        >
                          End Date <span>Optional</span>
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          className="form-control"
                          value={availData.end_date}
                          onChange={handleAvailChangePopup}
                        />
                      </div>
                    </div>
                    <small style={{ color: "red" }}>
                      {error?.end_date?.length ? error?.end_date[0] : <></>}
                    </small>
                    <div className="formbold-input-flex">
                      <div>
                        <label
                          htmlFor="start_time"
                          className="formbold-form-label"
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="start_time"
                          className="form-control"
                          value={availData.start_time}
                          onChange={handleAvailChangePopup}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="end_time"
                          className="formbold-form-label"
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          name="end_time"
                          className="form-control"
                          value={availData.end_time}
                          onChange={handleAvailChangePopup}
                        />
                      </div>
                    </div>
                    <div className="formbold-input-flex diff">
                      <div>
                        <label htmlFor="note" className="formbold-form-label">
                          Note <span>Optional</span>
                        </label>

                        <textarea
                          name="note"
                          className="form-control"
                          value={availData.note}
                          onChange={handleAvailChangePopup}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr></hr>
                <div className="formbold-form-btn-wrapper">
                  <div className="btn-end">
                    <Link className="cancel" onClick={closeModal}>
                      Cancel
                    </Link>

                    <button
                      className="formbold-btn"
                      onClick={updateAvailability}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ReactModal>
        <main className="content">
          {/* <ToastContainer /> */}
          <div className="container-fluid p-0">
            <div className="row d-flex">
              <div className="col-xl-4 col-xxl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="initials">
                      <div className="image-user">
                        <h2>{initial && initial.toLocaleUpperCase()}</h2>
                      </div>
                    </div>
                    <div
                      className="edit-user"
                      onClick={(e) => openModal("profile")}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </div>

                    <div className="title-user">
                      {tutorFetchData?.first_name} {tutorFetchData?.last_name}
                    </div>
                    {tutorFetchData?.tutor_status && (
                      <>
                        <div className="active-user">
                          <span className="active">
                            {tutorFetchData?.tutor_status}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="link-to-family">
                      {/* <Link to={"/"}>View Account</Link> */}
                      <div>
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <span> {tutorFetchData?.email} </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="arrange-edit-sign">
                      <h3>Notes</h3>
                      <div className="student-edit-user">
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </div>
                    </div>
                    <span>
                      Click the edit button to add a private note about this
                      tutor
                    </span>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="arrange-edit-sign">
                      <h3>Attachments</h3>
                      <div className="student-edit-user add">
                        <i className="fa fa-plus" aria-hidden="true"></i> Add
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-xxl-8">
                {/* <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          <strong>Tutor Overview</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="student-properties-edit">
                            <h3>Tutor Overview</h3>
                            <div className="student-edit-user">
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                          <div className="formbold-input-flex">
                            <div>
                              <label
                                htmlFor="preferences"
                                className="formbold-form-label"
                              >
                                Preferences
                              </label>
                              <br></br>
                              <div className="preference">
                                <input type="checkbox" name="emailpreference" />
                                Send email lesson reminders
                              </div>
                              <div className="preference">
                                <input type="checkbox" name="smspreference" />
                                Send SMS lesson reminders
                              </div>
                              <span style={{ paddingLeft: "23px" }}>
                                Will only be sent if SMS messaging is allowed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseTwo"
                        >
                          <strong>Tutor Contacts</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingTwo"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="student-properties-edit">
                            {tutorFetchData?.parentfirstname !== null &&
                            tutorFetchData?.parentlastname !== null ? (
                              <>
                                <h3>
                                  {`${tutorFetchData?.parentfirstname}, ${tutorFetchData?.parentlastname}`}
                                </h3>
                              </>
                            ) : (
                              <>
                                <strong>Parents Name not submitted</strong>
                              </>
                            )}

                            <div className="student-edit-user">
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                          <div className="formbold-input-flex">
                            <div>
                              <label
                                htmlFor="preferences"
                                className="formbold-form-label"
                              >
                                Preferences
                              </label>
                              <br></br>
                              <div className="preference">
                                <input type="checkbox" name="emailpreference" />
                                Set as the preferred invoice recipient
                              </div>
                              <div className="preference">
                                <input type="checkbox" name="smspreference" />
                                Show in Student Portal contacts
                              </div>
                              <div className="preference">
                                <input type="checkbox" name="emailpreference" />
                                Send email lesson reminders
                              </div>
                              <div className="preference">
                                <input type="checkbox" name="smspreference" />
                                Send SMS lesson reminders
                              </div>
                              <span style={{ paddingLeft: "23px" }}>
                                Will only be sent if SMS messaging is allowed
                              </span>
                            </div>
                          </div>
                          <hr></hr>
                          <div className="formbold-form-btn-wrapper">
                            <div className="btn-end">
                              <Link className="cancel" to="/students">
                                <i
                                  className="fa fa-exchange"
                                  aria-hidden="true"
                                ></i>
                                Change Family
                              </Link>

                              <button className="formbold-btn">
                                <i
                                  style={{ color: "#ffffff" }}
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                                Add Another Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          <strong>Assigned Students</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingOne"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <h3>Assigned Students</h3>

                          <div className="row">
                            <div className="col-12 col-md-12 col-xxl-12 d-flex order-2 order-xxl-3">
                              <div className="flex-fill w-100">
                                <div className="py-3">
                                  <div className="chart chart-xs">
                                    <img src={students}></img>
                                  </div>
                                </div>
                                <h5>
                                  <strong>
                                    There aren't any student assigned to this
                                    tutor
                                  </strong>
                                </h5>
                                <hr></hr>
                                <div className="formbold-form-btn-wrapper">
                                  <div className="btn-end">
                                    <button
                                      className="formbold-btn"
                                      onClick={(e) =>
                                        openModal("assignStudent")
                                      }
                                    >
                                      <i
                                        style={{ color: "#ffffff" }}
                                        className="fa fa-plus"
                                        aria-hidden="true"
                                      ></i>
                                      Assign Student
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingTwo">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseTwo"
                        >
                          <strong>Payroll</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingTwo"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-12 col-md-12 col-xxl-12 d-flex order-2 order-xxl-3">
                              <div className="flex-fill w-100">
                                <div className="py-3">
                                  <div className="chart chart-xs payroll-img">
                                    <img src={payroll} alt="payroll"></img>
                                  </div>
                                </div>
                                <h6 className="text-center">
                                  <strong>
                                    You haven't added any payroll entries yet
                                  </strong>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingThree">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseThree"
                          aria-expanded="false"
                          aria-controls="flush-collapseThree"
                        >
                          <strong>Availablity</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingThree"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="student-properties-edit sec-acc">
                            <h3>Availability</h3>

                            <button
                              className="formbold-btn"
                              style={{ fontSize: "14px", padding: "6px 16px" }}
                              onClick={(e) => setAvailFlag(!e.target.value)}
                            >
                              <i
                                style={{ color: "#ffffff" }}
                                className="fa fa-plus"
                                aria-hidden="true"
                              ></i>
                              Add
                            </button>
                          </div>
                          <div className="formbold-input-flex">
                            <span style={{ lineHeight: "1.6" }}>
                              Enter your tutoring availability here to provide a
                              visual cue of your availability on the calendar
                              (visible in "Day" view or "Timeline" view).
                              Setting your availability will not add or remove
                              lessons from the calendar, or prevent lessons from
                              being scheduled outside of these days/times.
                            </span>
                          </div>

                          <p>
                            You haven't added your tutoring availability yet
                          </p>
                          {availFlag && (
                            <>
                              <div className="availablity">
                                <div className="formbold-input-flex diff">
                                  <div>
                                    <label
                                      htmlFor="availability"
                                      className="formbold-form-label"
                                    >
                                      Add Availability
                                    </label>
                                  </div>
                                </div>
                                <div className="formbold-input-flex diff">
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="days"
                                        className="formbold-form-label"
                                      >
                                        Days
                                      </label>
                                    </div>
                                    <small style={{ color: "red" }}>
                                      {error?.days?.length ? (
                                        error?.days[0]
                                      ) : (
                                        <></>
                                      )}
                                    </small>
                                    <div className="studentStatus">
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="sun"
                                          value="Sun"
                                          onChange={handleAvailChange}
                                        />
                                        Sun
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="mon"
                                          value="Mon"
                                          onChange={handleAvailChange}
                                        />
                                        Mon
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="tue"
                                          value="Tue"
                                          onChange={handleAvailChange}
                                        />
                                        Tue
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="wed"
                                          value="Wed"
                                          onChange={handleAvailChange}
                                        />
                                        Wed
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="thu"
                                          value="Thu"
                                          onChange={handleAvailChange}
                                        />
                                        Thu
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="fri"
                                          value="Fri"
                                          onChange={handleAvailChange}
                                        />
                                        Fri
                                      </div>
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="status"
                                          name="sat"
                                          value="Sat"
                                          onChange={handleAvailChange}
                                        />
                                        Sat
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="formbold-input-flex">
                                  <div>
                                    <label
                                      htmlFor="start_date"
                                      className="formbold-form-label"
                                    >
                                      Start Date <span>Optional</span>
                                    </label>
                                    <input
                                      type="date"
                                      name="start_date"
                                      className="form-control"
                                      onChange={handleAvailChange}
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="end_date"
                                      className="formbold-form-label"
                                    >
                                      End Date <span>Optional</span>
                                    </label>
                                    <input
                                      type="date"
                                      name="end_date"
                                      className="form-control"
                                      onChange={handleAvailChange}
                                    />
                                  </div>
                                </div>
                                <small style={{ color: "red" }}>
                                  {error?.end_date?.length ? (
                                    error?.end_date[0]
                                  ) : (
                                    <></>
                                  )}
                                </small>
                                <div className="formbold-input-flex">
                                  <div>
                                    <label
                                      htmlFor="start_time"
                                      className="formbold-form-label"
                                    >
                                      Start Time
                                    </label>
                                    <input
                                      type="time"
                                      name="start_time"
                                      className="form-control"
                                      onChange={handleAvailChange}
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="end_time"
                                      className="formbold-form-label"
                                    >
                                      End Time
                                    </label>
                                    <input
                                      type="time"
                                      name="end_time"
                                      className="form-control"
                                      onChange={handleAvailChange}
                                    />
                                  </div>
                                </div>
                                <div className="formbold-input-flex diff">
                                  <div>
                                    <label
                                      htmlFor="note"
                                      className="formbold-form-label"
                                    >
                                      Note <span>Optional</span>
                                    </label>

                                    <textarea
                                      name="note"
                                      className="form-control"
                                      onChange={handleAvailChange}
                                    />
                                  </div>
                                </div>
                                <div className="formbold-form-btn-wrapper justify-content-end">
                                  <div className="btn-end">
                                    <Link
                                      className="cancel"
                                      onClick={() => setAvailFlag(false)}
                                    >
                                      Cancel
                                    </Link>

                                    <button
                                      className="formbold-btn"
                                      onClick={formAvailSubmit}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {!availFlag && (
                            <>
                              {getAvailabilityData?.map((item, index) => {
                                let day = JSON.parse(item.days);
                                return (
                                  <div
                                    className="edit-availability-section"
                                    key={index}
                                  >
                                    <div className="availability-data">
                                      <div className="d-flex">
                                        {day.map((single_day, index) => {
                                          if (index === day.length - 1) {
                                            return (
                                              <>
                                                <strong key={index}>
                                                  {`${single_day}`}
                                                </strong>
                                              </>
                                            );
                                          } else {
                                            return (
                                              <>
                                                <strong>
                                                  {`${single_day}${","}`}
                                                  &nbsp;
                                                </strong>
                                              </>
                                            );
                                          }
                                        })}
                                      </div>

                                      <span>
                                        {item.start_date} to {item.end_date}
                                      </span>
                                      <span>{item.note}</span>
                                    </div>
                                    <div className="availability-time">
                                      <span>
                                        {item.start_time} to {item.end_time}
                                      </span>
                                    </div>
                                    <div className="availability-edit-del">
                                      <div>
                                        <i
                                          className="fa fa-pencil"
                                          aria-hidden="true"
                                          onClick={() =>
                                            editAvailability(item.id)
                                          }
                                        ></i>
                                      </div>
                                      <div>
                                        <i
                                          className="fa fa-trash"
                                          aria-hidden="true"
                                          onClick={() =>
                                            deleteAvailability(item.id)
                                          }
                                        ></i>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingFive">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseFive"
                          aria-expanded="false"
                          aria-controls="flush-collapseFive"
                        >
                          <strong>Attendence and Notes</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseFive"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingFive"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-12 col-md-12 col-xxl-12 d-flex order-2 order-xxl-3">
                              <div className="flex-fill w-100">
                                <div className="py-3">
                                  <div className="chart chart-xs payroll-img">
                                    <img src={attendance} alt="payroll"></img>
                                  </div>
                                </div>
                                <h6 className="text-center">
                                  <strong>
                                    This tutor hasn't taken attendance yet
                                  </strong>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div
                        id="flush-collapseFive"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingFive"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="student-properties-edit">
                            <h3>Average attendance for last 90 days</h3>
                          </div>
                          <div className="avg-attend">
                            <div className="avg-data">
                              <span>0</span>
                              <span>Present</span>
                            </div>
                            <div className="avg-data">
                              <span>0</span>
                              <span>Unrecorded</span>
                            </div>
                            <div className="avg-data">
                              <span>0</span>
                              <span>Student Absences</span>
                            </div>
                            <div className="avg-data">
                              <span>0</span>
                              <span>Total Events</span>
                            </div>
                          </div>
                          <div className="formbold-form-btn-wrapper">
                            <div className="btn-end">
                              <button className="formbold-btn">
                                <i
                                  style={{ color: "#ffffff" }}
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                                Create Report
                              </button>
                            </div>
                          </div>
                          <div className="calendar-body">
                            <h5>
                              {tutorFetchData?.first_name}'s attendance records
                              as of <emp>{startDate ? startDate : "no"}</emp>{" "}
                              <i
                                onClick={handleClick}
                                className="fa fa-caret-down"
                                aria-hidden="true"
                              >
                                {isOpen && (
                                  <DatePicker
                                    selected={todayDate}
                                    onChange={handleChange}
                                    inline
                                  />
                                )}
                              </i>
                            </h5>

                            <FetchAttendanceLog />
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingSix">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseSix"
                          aria-expanded="false"
                          aria-controls="flush-collapseSix"
                        >
                          <strong>Preferences</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseSix"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingSix"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="student-properties-edit sec-acc">
                            <h3>Attendance Preferences</h3>
                            <div
                              className="student-edit-user"
                              onClick={handleAttendEdit}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>
                          <div className="formbold-input-flex">
                            <div>
                              <label
                                htmlFor="overdue_attendence"
                                className="formbold-form-label"
                              >
                                Overdue Attendance
                              </label>
                              <br></br>
                              <div
                                className="preference"
                                style={{ fontSize: "15px" }}
                              >
                                <input
                                  type="checkbox"
                                  name="overdue_attendence"
                                  value="true"
                                  disabled={attendDisabled}
                                  onChange={handleChange}
                                  checked={
                                    tenantData?.overdue_attendence !== null
                                      ? true
                                      : false
                                  }
                                />
                                Show overdue attendance on homepage
                              </div>
                            </div>
                          </div>

                          <div className="formbold-input-flex diff">
                            <div>
                              <div>
                                <label
                                  htmlFor="default_notes_view"
                                  className="formbold-form-label"
                                >
                                  Default Notes View
                                </label>
                              </div>
                              <div className="input-radio">
                                <input
                                  type="radio"
                                  value="Student"
                                  name="default_notes_view"
                                  disabled={attendDisabled}
                                  onChange={handleChange}
                                  checked={
                                    tenantData?.default_notes_view === "Student"
                                      ? true
                                      : false
                                  }
                                ></input>
                                Student
                                <input
                                  type="radio"
                                  value="Parent"
                                  name="default_notes_view"
                                  disabled={attendDisabled}
                                  onChange={handleChange}
                                  checked={
                                    tenantData?.default_notes_view === "Parent"
                                      ? true
                                      : false
                                  }
                                ></input>
                                Parent
                                <input
                                  type="radio"
                                  value="Private"
                                  name="default_notes_view"
                                  disabled={attendDisabled}
                                  onChange={handleChange}
                                  checked={
                                    tenantData?.default_notes_view === "Private"
                                      ? true
                                      : false
                                  }
                                ></input>
                                Private
                              </div>
                            </div>
                          </div>

                          <div className="formbold-input-flex diff mb-0">
                            <div>
                              <label
                                htmlFor="automatically_copy_lesson"
                                className="formbold-form-label"
                              >
                                Lesson Notes
                              </label>
                              <br></br>
                              <div
                                className="preference"
                                style={{ fontSize: "15px" }}
                              >
                                <input
                                  type="checkbox"
                                  name="automatically_copy_lesson"
                                  value="true"
                                  disabled={attendDisabled}
                                  onChange={handleChange}
                                  checked={
                                    tenantData?.automatically_copy_lesson !==
                                    null
                                      ? true
                                      : false
                                  }
                                />
                                Automatically copy lesson notes when I take
                                attendance
                              </div>
                            </div>
                          </div>

                          <div className="formbold-input-flex diff">
                            <div
                              className="input-radio"
                              style={{ fontSize: "15px" }}
                            >
                              <input
                                type="radio"
                                value="Copy from most recent event"
                                name="copy_recent_event"
                                disabled={attendDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.copy_recent_event ===
                                  "Copy from most recent event"
                                    ? true
                                    : false
                                }
                              ></input>
                              Copy from most recent event
                              <input
                                type="radio"
                                value="Copy from same category only"
                                name="copy_recent_event"
                                disabled={attendDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.copy_recent_event ===
                                  "Copy from same category only"
                                    ? true
                                    : false
                                }
                              ></input>
                              Copy from same category only
                            </div>
                          </div>
                        </div>
                        <div className="accordion-body pt-0">
                          <div className="student-properties-edit sec-acc">
                            <h3>Email Notification Preferences</h3>

                            <div
                              className="student-edit-user"
                              onClick={handleEmailEdit}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>

                          <small className="small">
                            Select what you'd like to be notified about via
                            email and how often
                          </small>
                          <div className="make-pad pb-3">
                            <div className="input-check">
                              <input
                                type="checkbox"
                                name="student_register_lesson"
                                value="When any student registers for a lesson/event
                                through the Student Portal"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.student_register_lesson !== null
                                    ? true
                                    : false
                                }
                              ></input>
                              When any student registers for a lesson/event
                              through the Student Portal
                            </div>
                            <div className="input-check">
                              <input
                                type="checkbox"
                                name="student_cancel_lesson"
                                value="When any student cancels a lesson/event through
                                the Student Portal"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.student_cancel_lesson !== null
                                    ? true
                                    : false
                                }
                              ></input>
                              When any student cancels a lesson/event through
                              the Student Portal
                            </div>
                            <div className="input-check">
                              <input
                                type="checkbox"
                                name="parent_student_signup"
                                value="When any parent or student completes the sign-up
                                form"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.parent_student_signup !== null
                                    ? true
                                    : false
                                }
                              ></input>
                              When any parent or student completes the sign-up
                              form
                            </div>
                            <div className="input-check">
                              <input
                                type="checkbox"
                                name="parent_student_disable_email_reminder"
                                value="When any parent or student disables email
                                reminders"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.parent_student_disable_email_reminder !==
                                  null
                                    ? true
                                    : false
                                }
                              ></input>
                              When any parent or student disables email
                              reminders
                            </div>
                            <div className="input-check">
                              <input
                                type="checkbox"
                                name="allow_student_email_studylog"
                                value="Allow students to email me from the Study Log"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.allow_student_email_studylog !==
                                  null
                                    ? true
                                    : false
                                }
                              ></input>
                              Allow students to email me from the Study Log
                            </div>
                          </div>
                          <div className="email-pad-top">
                            <h5>
                              <strong>Email Daily Agenda</strong>
                            </h5>
                            <div className="input-radio">
                              <input
                                type="radio"
                                value="Day Before"
                                name="daily_agenda"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.daily_agenda === "Day Before"
                                    ? true
                                    : false
                                }
                              ></input>
                              Day Before
                              <br />
                              Between 16:00 and 23:00
                              <input
                                type="radio"
                                value="Same Day"
                                name="daily_agenda"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.daily_agenda === "Same Day"
                                    ? true
                                    : false
                                }
                              ></input>
                              Same Day
                              <br />
                              Between 0:00 and 15:00
                              <input
                                type="radio"
                                value="Don't Email"
                                name="daily_agenda"
                                disabled={emailDisabled}
                                onChange={handleChange}
                                checked={
                                  tenantData?.daily_agenda === "Don't Email"
                                    ? true
                                    : false
                                }
                              ></input>
                              Don't Email
                            </div>
                          </div>
                          {attendFlag && (
                            <>
                              <div className="formbold-form-btn-wrapper justify-content-end">
                                <div className="btn-end">
                                  <Link
                                    className="cancel"
                                    onClick={handleCancelAttendFlag}
                                  >
                                    Cancel
                                  </Link>

                                  <button
                                    className="formbold-btn"
                                    onClick={formSubmit}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingSeven">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseSeven"
                          aria-expanded="false"
                          aria-controls="flush-collapseSeven"
                        >
                          <strong>Privileges</strong>
                        </button>
                      </h2>
                      <div
                        id="flush-collapseSeven"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingSeven"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="access d-flex flex-col">
                            <h3>User Privileges</h3>
                            <div
                              className="edit_privileges"
                              onClick={handleEditClick}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </div>
                          </div>

                          <form className="myForm">
                            <div>
                              <div className="formbold-input-flex diff">
                                <div>
                                  <input
                                    type="checkbox"
                                    className="administrator"
                                    name="administrator"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "administrator"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="administrator"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Administrator (all privileges)
                                  </label>
                                  <br />
                                  <span>
                                    Administrators can access all parts of
                                    TutorBird and create other users.
                                  </span>
                                </div>
                              </div>
                              <h6 className="formbold-form-label">
                                Manage Self
                              </h6>
                              <div className="formbold-input-flex diff">
                                <div>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_self_take_attendance"
                                    disabled={true}
                                    onChange={handleCheckboxChange}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_self_take_attendance"
                                      )
                                        ? true
                                        : true
                                    }
                                  />
                                  <label
                                    htmlFor="manage_self_take_attendance"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Take attendance
                                  </label>
                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_self_record_payments"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_self_record_payments"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_self_record_payments"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Record payments with attendance
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_self_edit"
                                    onChange={handleCheckboxChange}
                                    //  checked={privileges.manage_self_edit}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_self_edit"
                                      )
                                        ? true
                                        : true
                                    }
                                    disabled={true}
                                  />
                                  <label
                                    htmlFor="manage_self_edit"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Edit own lessons/events
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_self_payroll"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_self_payroll"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_self_payroll"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View own payroll privileges
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_self_mileage"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.manage_self_mileage}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_self_mileage"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_self_mileage"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Add/edit mileage
                                  </label>
                                </div>
                              </div>

                              <h6 className="formbold-form-label">
                                Manage Other Tutors
                              </h6>
                              <div className="formbold-input-flex diff">
                                <div>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_view_tutor"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    //  checked={privileges.manage_view_tutor}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_view_tutor"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_view_tutor"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View other tutor and user contact info
                                  </label>
                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_student_tutor"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.manage_student_tutor}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_student_tutor"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_student_tutor"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Manage students and other tutors'
                                    lesson/events
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_tutor_lesson"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.manage_tutor_lesson}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_tutor_lesson"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_tutor_lesson"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View other tutors' lesson/events
                                  </label>
                                </div>
                              </div>

                              <h6 className="formbold-form-label">
                                Manage Student and Parents
                              </h6>
                              <div className="formbold-input-flex diff">
                                <div>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_student_parent"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.manage_student_parent}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_student_parent"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_student_parent"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View student/parent addresses and phone
                                    numbers
                                  </label>
                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="manage_student_parent_email"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    //  checked={privileges.manage_student_parent_email}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "manage_student_parent_email"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="manage_student_parent_email"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View student/parent email addresses
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="download_student_profile"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.download_student_profile}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "download_student_profile"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="download_student_profile"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    View/download student profile attachments
                                  </label>
                                </div>
                              </div>

                              <h6 className="formbold-form-label">
                                Other Privileges
                              </h6>
                              <div className="formbold-input-flex diff">
                                <div>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="add_invoices"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.add_invoices}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "add_invoices"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="add_invoices"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Add/view invoices and accounts
                                  </label>
                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="add_expenses"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    //  checked={privileges.add_expenses}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "add_expenses"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="add_expenses"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Add/edit expenses and other revenue
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="update_online_resources"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.update_online_resources}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "add_expenses"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="update_online_resources"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Can add/edit/delete online resources from
                                    the school space
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="edit_website"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.edit_website}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "edit_website"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="edit_website"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Edit website and post news
                                  </label>

                                  <br></br>
                                  <input
                                    type="checkbox"
                                    className="manage"
                                    name="view_reports"
                                    disabled={!editPrivileges}
                                    onChange={handleCheckboxChange}
                                    // checked={privileges.view_reports}
                                    checked={
                                      checkedPrivileges?.includes(
                                        "view_reports"
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                  <label
                                    htmlFor="view_reports"
                                    className="form-form-label"
                                  >
                                    {" "}
                                    Create/View reports
                                  </label>
                                  <br></br>
                                  <span>
                                    Gives access to reports created by other
                                    tutors/admins in the business (may contain
                                    sensitive data).
                                  </span>
                                </div>
                              </div>
                              <div className="formbold-form-btn-wrapper">
                                {editPrivileges && (
                                  <>
                                    <div className="btn-end">
                                      <button
                                        className="cancel"
                                        onClick={handleCancelClick}
                                      >
                                        Cancel
                                      </button>

                                      <button
                                        className="formbold-btn"
                                        // onClick={formSubmit}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorEditDetails;
