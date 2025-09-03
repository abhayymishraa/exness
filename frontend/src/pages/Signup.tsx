import { useNavigate } from "react-router";
import { submitsignup } from "../api/trade";
import { useEffect, useState } from "react";

export default function Signup() {
  const [error, setError] = useState<string>("");
  const [submitted, setIsSubmitted] = useState(false);
  const naviagte = useNavigate();
  useEffect(() => {
    const loggedin = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="))
      ?.split("=")[1];
    console.log("loggedin as ", loggedin);
    if (loggedin) {
      naviagte("/signin");
    }
  });

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    const formdata = new FormData(e.target as HTMLFormElement);
    const email = formdata.get("mail");
    const pass = formdata.get("pass");
    if (!email || !pass) {
      return;
    }
    const data = await submitsignup(email as string, pass as string);

    if (data.userId) {
      alert("You are transferred to singin! please sign in");
      naviagte("/signin");
      setIsSubmitted(false);
    }
    setIsSubmitted(false);
    setError(data.message);
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="border-2 rounded-xl shadow-xl">
        <div className="p-12">
          <div className=" p-2 pb-4 w-full text-center ">
            <h1 className=" text-blue-300 text-xl font-bold font-sans">
              SignUp
            </h1>
          </div>
          <form onSubmit={handlesubmit}>
            <div className="flex flex-col gap-2 items-start">
              <label>Please enter you email:</label>
              <input
                placeholder="examplemail@gmail.com"
                type="email"
                name="mail"
                className="border-2 rounded-md p-2"
              />
              {error !== "" ? <h1 className="text-red-500">{error}</h1> : <></>}
            </div>
            <div className=" flex flex-col pt-4">
              <label>Password:</label>
              <input
                placeholder="Min 6 letters and Max 20 letters"
                type="password"
                name="pass"
                className="border-2 rounded-md p-2"
              />
            </div>
            {error !== "" ? <h1 className="text-red-500">{error}</h1> : <></>}
            <div className="flex w-full items-center justify-center p-2 mt-4 ">
              <button
                type="submit"
                className="py-3 px-8 rounded-xl border cursor-pointer bg-purple-400 shadow-xl "
                disabled={submitted}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
