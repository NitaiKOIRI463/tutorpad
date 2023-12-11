import React, { useState } from "react";
import MiniSidebar from "../../sidebar/MiniSidebar.js";
import Sidebar from "../../sidebar/Sidebar.js";
import TopBar from "../../sidebar/TopBar.js";
import { useUserDataContext } from "../../../contextApi/userDataContext.js";
import "./assets/css/style.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../../utils/config.js";
import axios from "axios";

const StudentAdd = () => {
  const { sidebarToggle, token } = useUserDataContext();
  const [additionalDetails, setAdditionalDetails] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepMenuOne = document.querySelector(".formbold-step-menu1");
    const stepMenuTwo = document.querySelector(".formbold-step-menu2");

    const stepOne = document.querySelector(".formbold-form-step-1");
    const stepTwo = document.querySelector(".formbold-form-step-2");

    // const formSubmitBtn = document.querySelector(".formbold-btn");
    const formBackBtn = document.querySelector(".formbold-back-btn");

    let input = document.querySelectorAll("input[type=text]");
    let emailfield = document.querySelectorAll("input[type=email]");

    let req = false;
    let flagemail = false;

    for (let [key, value] of Object.entries(input)) {
      // console.log("value", value.value);
      if (
        value.required === true &&
        (value.value === "" || value.value === undefined)
      ) {
        // console.log("value.name", value.name);
        // console.log("value.value", value.value);

        value.className = "border-2 border-danger form-control";
        let label = document.getElementById(value.name);
        label.className = "formbold-form-label text-danger";
        req = true;

        label.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      } else if (value.required && value.value) {
        console.log("value", value.value);

        value.className = "form-control";
        let label = document.getElementById(value.name);
        label.className = "formbold-form-label";
      }
    }
    for (let [key, value] of Object.entries(emailfield)) {
      // console.log("value", value.value);
      if (
        value.required === true &&
        (value.value === "" || value.value === undefined)
      ) {
        // console.log("value.name", value.name);
        // console.log("value.value", value.value);

        value.className = "border-2 border-danger form-control";
        let label = document.getElementById(value.name);
        label.className = "formbold-form-label text-danger";
        flagemail = true;
        label.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      } else if (value.required && value.value) {
        console.log("value", value.value);

        value.className = "form-control";
        let label = document.getElementById(value.name);
        label.className = "formbold-form-label";
      }
    }
    if (req === false && flagemail === false) {
      stepMenuOne.classList.remove("active");
      stepMenuTwo.classList.add("active");

      stepOne.classList.remove("active");
      stepTwo.classList.add("active");

      formBackBtn.classList.add("active");
      formBackBtn.addEventListener("click", function (event) {
        event.preventDefault();

        stepMenuOne.classList.add("active");
        stepMenuTwo.classList.remove("active");

        stepOne.classList.add("active");
        stepTwo.classList.remove("active");

        formBackBtn.classList.remove("active");
      });
      // formSubmitBtn.textContent = "Submit";
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };
  const formSubmit = async (e) => {
    e.preventDefault();
    const config = {
      method: "POST",
      url: `${API_URL}user/create-student`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        first_name: formData.firstname,
        last_name: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        user_id: 4,
      },
      // validateStatus: (status) => status !== 404,
    };
    await axios(config)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdditionalDetails = () => {
    if (additionalDetails === true) {
      setAdditionalDetails(false);
    } else {
      setAdditionalDetails(true);
    }
  };
  return (
    <div className="wrapper">
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

        <main className="content studentadd">
          <div className="container-fluid p-0">
            <div className="row d-flex">
              <div className="col-xl-12 col-xxl-12">
                <div className="formbold-main-wrapper">
                  <div className="back-link">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <Link to="/students"> Back to Students</Link>
                  </div>
                  <h1>Add New Student</h1>
                  <div className="formbold-form-wrapper">
                    <form name="myForm">
                      <div className="formbold-steps">
                        <ul>
                          <li className="formbold-step-menu1 active">
                            <span>1</span>
                            Student Details
                          </li>
                          <li className="formbold-step-menu2">
                            <span>2</span>
                            Confirm
                          </li>
                        </ul>
                      </div>

                      <div className="formbold-form-step-1 active">
                        <div className="formbold-input-flex">
                          <div>
                            <label
                              htmlFor="firstname"
                              className="formbold-form-label"
                              id="firstname"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              name="firstname"
                              className="form-control"
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lastname"
                              className="formbold-form-label"
                              id="lastname"
                            >
                              Last name
                            </label>
                            <input
                              type="text"
                              name="lastname"
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
                              required
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
                                Phone Number
                              </label>
                              <input
                                type="text"
                                name="phone"
                                className="form-control"
                                required
                                onChange={handleChange}
                              />
                            </div>
                            <input type="checkbox" className="sms" name="sms" />
                            SMS Capable
                          </div>
                        </div>
                        <div
                          className="addn-details"
                          onClick={handleAdditionalDetails}
                        >
                          <i className="fa fa-plus" aria-hidden="true"></i>
                          <h6>
                            {" "}
                            {additionalDetails ? "Hide" : "Show"} Additional
                            Details
                          </h6>
                        </div>
                        {additionalDetails && (
                          <>
                            <div className="formbold-input-flex">
                              <div>
                                <label
                                  htmlFor="gender"
                                  className="formbold-form-label"
                                >
                                  Gender <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="gender"
                                  className="form-control"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="dob"
                                  className="formbold-form-label"
                                >
                                  Date of Birth <span>Optional</span>
                                </label>
                                <input
                                  type="date"
                                  name="dob"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="formbold-input-flex">
                              <div>
                                <label
                                  htmlFor="skype"
                                  className="formbold-form-label"
                                >
                                  Skype Username <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="skype"
                                  className="form-control"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="facetime"
                                  className="formbold-form-label"
                                >
                                  FaceTime ID <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="facetime"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="formbold-input-flex">
                              <div>
                                <label
                                  htmlFor="school"
                                  className="formbold-form-label"
                                >
                                  School <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="school"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="formbold-input-flex">
                              <div>
                                <label
                                  htmlFor="studentsince"
                                  className="formbold-form-label"
                                >
                                  Student Since <span>Optional</span>
                                </label>
                                <input
                                  type="date"
                                  name="studentsince"
                                  className="form-control"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="referrer"
                                  className="formbold-form-label"
                                >
                                  Referrer <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="referrer"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="formbold-input-flex diff">
                              <div>
                                <label
                                  htmlFor="subjects"
                                  className="formbold-form-label"
                                >
                                  Subjects <span>Optional</span>
                                </label>
                                <br></br>
                                <small>
                                  Use a semicolon or press the Enter key to
                                  separate entries
                                </small>
                                <input
                                  type="text"
                                  name="subjects"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="formbold-input-flex">
                              <div>
                                <label
                                  htmlFor="skill"
                                  className="formbold-form-label"
                                >
                                  Skill Level <span>Optional</span>
                                </label>
                                <input
                                  type="text"
                                  name="skill"
                                  className="form-control"
                                />
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
                                  <input
                                    type="checkbox"
                                    name="emailpreference"
                                  />
                                  Send email lesson reminders
                                </div>
                                <div className="preference">
                                  <input type="checkbox" name="smspreference" />
                                  Send SMS lesson reminders
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <br></br>
                        <div className="formbold-input-flex diff">
                          <div>
                            <div>
                              <label
                                htmlFor="status"
                                className="formbold-form-label"
                              >
                                Student Status
                              </label>
                            </div>
                            <div className="studentStatus">
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="student_status"
                                />
                                <span
                                  className="bg-design"
                                  style={{
                                    color: "#18790b",
                                    backgroundColor: "#b3f3b3bd",
                                    borderRadius: "5px",
                                  }}
                                >
                                  Active
                                </span>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="student_status"
                                />
                                <span
                                  className="bg-design"
                                  style={{
                                    color: "#005c5c",
                                    backgroundColor: "rgb(179 210 243 / 74%)",
                                    borderRadius: "5px",
                                  }}
                                >
                                  Trial
                                </span>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="student_status"
                                />
                                <span
                                  className="bg-design"
                                  style={{
                                    color: "#e34c00",
                                    backgroundColor: "rgb(253 232 222 / 74%)",
                                    borderRadius: "5px",
                                  }}
                                >
                                  Waiting
                                </span>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="student_status"
                                />
                                <span
                                  className="bg-design"
                                  style={{
                                    color: "#604274",
                                    backgroundColor: "rgb(238 205 249 / 74%)",
                                    borderRadius: "5px",
                                  }}
                                >
                                  Lead
                                </span>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="student_status"
                                />
                                <span
                                  className="bg-design"
                                  style={{
                                    color: "#344242",
                                    backgroundColor: "rgb(208 219 231 / 74%)",
                                    borderRadius: "5px",
                                  }}
                                >
                                  Inactive
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr></hr>
                        <div className="formbold-input-flex diff">
                          <div>
                            <div>
                              <label
                                htmlFor="studentType"
                                className="formbold-form-label"
                              >
                                Student Type
                              </label>
                            </div>
                            <div className="studentStatus">
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="studentType"
                                />
                                Adult
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="studentType"
                                />
                                Child
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="formbold-input-flex diff">
                          <div>
                            <div>
                              <label
                                htmlFor="studentFamily"
                                className="formbold-form-label"
                              >
                                This student's family is a/an
                              </label>
                            </div>
                            <div className="studentFamily">
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="studentFamily"
                                />
                                New Family
                                <br />
                              </div>

                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="studentFamily"
                                />
                                Existing Family
                              </div>
                            </div>
                            <small className="d-block">
                              reates a new account in Families & Invoices
                            </small>
                          </div>
                        </div>
                        <div className="formbold-input-flex">
                          <div>
                            <label
                              htmlFor="parentfirstname"
                              className="formbold-form-label"
                              id="parentfirstname"
                            >
                              Parent First Name
                            </label>
                            <input
                              type="text"
                              name="parentfirstname"
                              className="form-control"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="parentlastname"
                              className="formbold-form-label"
                              id="parentlastname"
                            >
                              Parent Last name
                            </label>
                            <input
                              type="text"
                              name="parentlastname"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-flex">
                          <div>
                            <label
                              htmlFor="parentemail"
                              className="formbold-form-label"
                            >
                              Email Address <span>Optional</span>
                            </label>
                            <input
                              type="email"
                              name="parentemail"
                              className="form-control"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="parentmobile"
                              className="formbold-form-label"
                            >
                              Mobile Number <span>Optional</span>
                            </label>
                            <input
                              type="text"
                              name="parentmobile"
                              className="form-control"
                            />
                            <input type="checkbox" className="sms" name="sms" />
                            SMS Capable
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
                            />
                          </div>
                        </div>
                        <div className="formbold-input-flex">
                          <div>
                            <label
                              htmlFor="parentpreferences"
                              className="formbold-form-label"
                            >
                              Preferences
                            </label>
                            <br></br>
                            <div className="preference">
                              <input
                                type="checkbox"
                                name="parentemailpreference"
                              />
                              Send email lesson reminders
                            </div>
                            <div className="preference">
                              <input
                                type="checkbox"
                                name="parentsmspreference"
                              />
                              Send SMS lesson reminders
                            </div>
                            <span>
                              Will only be sent if SMS messaging is allowed
                            </span>
                          </div>
                        </div>
                        <div className="formbold-input-flex">
                          <div>
                            <label
                              htmlFor="lessoncat"
                              className="formbold-form-label"
                            >
                              Default Lesson Category
                            </label>
                            <select name="lessoncat" className="form-control">
                              <option>Group Lesson</option>
                              <option>Lesson</option>
                              <option>Vacation</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="lessonlen"
                              className="formbold-form-label"
                            >
                              Default Lesson Length
                            </label>
                            <input
                              type="text"
                              name="lessonlen"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="formbold-input-flex diff">
                          <div>
                            <label
                              htmlFor="billing"
                              className="formbold-form-label"
                            >
                              Default Billing
                            </label>
                            <br></br>
                            <div className="preference">
                              <input type="radio" name="billing" />
                              Don't automatically create any calendar-generated
                              charges
                            </div>
                            <div className="preference">
                              <input type="radio" name="billing" />
                              Student pays based on the number of lessons taken
                            </div>
                            <div className="preference">
                              <input type="radio" name="billing" />
                              Student pays the same amount each month regardless
                              of number of lessons
                            </div>
                            <div className="preference">
                              <input type="radio" name="billing" />
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
                            >
                              Price <span>per hour</span>
                            </label>
                            <input
                              type="text"
                              name="price"
                              className="form-control"
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
                            <br></br>
                            <span>
                              Use this area for any private notes you wish to
                              keep.
                            </span>
                            <textarea name="note" className="form-control" />
                          </div>
                        </div>

                        <div className="formbold-form-btn-wrapper">
                          <div className="btn-end">
                            <Link className="cancel" to="/students">
                              Cancel
                            </Link>

                            <button
                              className="formbold-btn"
                              onClick={handleSubmit}
                            >
                              Next Step
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_1675_1807)">
                                  <path
                                    d="M10.7814 7.33312L7.20541 3.75712L8.14808 2.81445L13.3334 7.99979L8.14808 13.1851L7.20541 12.2425L10.7814 8.66645H2.66675V7.33312H10.7814Z"
                                    fill="white"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1675_1807">
                                    <rect width="16" height="16" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="formbold-form-step-2">
                        <h5>Set Up Automatic Invoicing</h5>
                        <p className="py-3">
                          You can set up automatic invoicing now, or you can set
                          it up later in the family account.
                        </p>
                        <div className="formbold-input-flex diff">
                          <div>
                            <div>
                              <label
                                htmlFor="invoicing"
                                className="formbold-form-label"
                              >
                                Would you like to set up automatic invoicing for
                                this family now?
                              </label>
                            </div>
                            <div className="invoicing">
                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="invoicing"
                                />
                                Yes
                                <br />
                              </div>

                              <div>
                                <input
                                  type="radio"
                                  className="status"
                                  name="invoicing"
                                />
                                No
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="formbold-form-btn-wrapper">
                          <button className="formbold-back-btn">Back</button>
                          <div className="btn-end">
                            <Link className="cancel" to="/students">
                              Cancel
                            </Link>

                            <button
                              className="formbold-btn"
                              onClick={formSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
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

export default StudentAdd;
