 import { Link } from "react-router-dom";

 const Navbar = () => {
   return (
     <nav>
       <ul className="flex gap-4 p-4 bg-gray-200">
         <li>
           <Link to="/">Home</Link>
         </li>
         <li>
           <Link to="/about">About</Link>
         </li>
         <li>
           <Link to="/contact">Contact</Link>
         </li>
         <li>
           <Link to="/dashboard">Dashboard</Link>
         </li>
         <li>
          <Link to="/login-form">Login</Link>
         </li>
         
       </ul>
     </nav>
   );
 }

 export default Navbar