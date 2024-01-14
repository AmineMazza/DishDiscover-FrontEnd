import React, { useState } from "react";
import im from "../assets/img-login.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Store/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      console.log(res.data);
      if (res.data?.token) {
        console.log("first");
        const { token, user } = res.data;
        signIn(token, user);
        console.log("b");
        navigate("/home");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center m-5">
      <div className="flex rounded-xl h-[90vh] flex-1 items-center justify-center">
        <img src={im} />
      </div>
      <div className="flex flex-col flex-1 items-center justify-center h-96 bg-blue-500">
        <h2 className="font-semibold text-5xl text-white">Dish Discover</h2>

        <input
          placeholder="example@email.com"
          type="email"
          className="flex h-10 w-2/3 rounded-full mt-6 mb-3 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="flex h-10 w-2/3 rounded-full mb-6 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="overflow-hidden relative w-32 p-2 h-12 bg-white text-blue-700 border-none rounded-full cursor-pointer relative z-10 group"
          onClick={handleSignIn}
        >
          Login
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12  transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left" />
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400  rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left" />
          <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600  rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left" />
          <span className="group-hover:opacity-100 group-hover:duration-1000 text-white duration-100 opacity-0 absolute top-2.5 left-6 z-10">
            Explore!
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
