// import React, { useState } from "react";
// import axios from "axios";
// import "../css/register.css";

// const Register = () => {
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const result = await axios.post('http://localhost:5000/api/auth/register', {
//                 email: email,
//                 name:username,
//                 password: password
//             }, {
//                 withCredentials: true // Ensure cookies are sent with requests
//               });
              
//             console.log(result.data);  // Handle success
//         } catch (error) {
//             console.error("There was an error!", error);  // Handle error
//         }
//     };

//     return (
//         <div className="register-container">
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="input-group">
//                     <label htmlFor="username">Username:</label>
//                     <input 
//                         type="text" 
//                         id="username" 
//                         name="username" 
//                         value={username} 
//                         onChange={(e) => setUsername(e.target.value)} 
//                         required 
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label htmlFor="email">Email:</label>
//                     <input 
//                         type="email" 
//                         id="email" 
//                         name="email" 
//                         value={email} 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         required 
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label htmlFor="password">Password:</label>
//                     <input 
//                         type="password" 
//                         id="password" 
//                         name="password" 
//                         value={password} 
//                         onChange={(e) => setPassword(e.target.value)} 
//                         required 
//                     />
//                 </div>
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// }

// export default Register;












import React, { useState } from "react";
import axios from "axios";
import Logo from './assets/logo.jpg'
import { useNavigate, Link } from "react-router-dom";
import OTPInput from "./OTPInput";

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [toggleOtp,setToggleOtp]=useState(false)


  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/auth/register`, {
        email: email,
        name: username,
        password: password
      }, {
        withCredentials: true // Ensure cookies are sent with requests
      });

      // console.log(result.data); // Handle success
      // navigate("/");
      // window.location.reload();
      setToggleOtp(true)

    } catch (error) {
      setToggleOtp(false)
      console.error("There was an error!", error); // Handle error
    }
  };





  return (
    <div style={{width:'100vw',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
    {!toggleOtp ? (<div className="w-full max-w-xs sm:max-w-sm bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <img src={Logo} alt="Logo" className="mx-auto w-29 h-20 sm:w-29 sm:h-24" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username:</label>
          <div className="relative">
            <input
              style={{    paddingLeft: '40px'}}
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4zM5 7a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z"></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="mb-4 relative">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email:</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.28 0 4.25-1.472 4.25-3.25S14.28 5.5 12 5.5s-4.25 1.472-4.25 3.25S9.72 12 12 12zm0 2.25c-3.06 0-5.5 1.528-5.5 3.5v.25h11v-.25c0-1.972-2.44-3.5-5.5-3.5z"></path>
              </svg>
            </span>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6v14h16V6H4zm12 10h-8v-4h8v4z"></path>
              </svg>
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-lg hover:from-green-500 hover:to-green-700 transition-colors shadow-md"
        >
          Register
        </button>
      </form>
      <div className="text-center mt-4">
      <Link to="/login" className="text-blue-500 hover:text-blue-700 text-sm">Already have an account? Login
      </Link>
      </div>
    </div>):


   ( <OTPInput setToggleOtp={setToggleOtp} email={email} url='verify-otp'/>)
    }

    </div>
  );
}

export default Register;
