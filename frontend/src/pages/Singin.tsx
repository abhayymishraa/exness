import { useNavigate } from "react-router";
import { submitsignin } from "../api/trade";
import { useState } from "react";

export default function Signin() {
  const [error, setError] = useState<string>("");
  const [submitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleClickElement = async () => {
    cookieStore.getAll().then((cookies) =>
      cookies.forEach((cookie) => {
        cookieStore.delete(cookie as string);
      })
    );
  };

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    const formdata = new FormData(e.target as HTMLFormElement);
    const email = formdata.get("mail");
    const pass = formdata.get("pass");
    if (!email || !pass) {
      return;
    }
    const data = await submitsignin(email as string, pass as string);

    if (data.token) {
      navigate("/trading");
    }
    setError(data.message);
    setIsSubmitted(false);
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="border-2 rounded-xl shadow-xl">
        <div className="p-12">
          <div className=" p-2 pb-4 w-full text-center ">
            <h1 className=" text-blue-300 text-xl font-bold font-sans">
              SignIn
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
            <div className="w-full">
              <h1>
                Please Sing in. If you are not a user{" "}
                <a
                  onClick={handleClickElement}
                  className="text-blue-500 underline"
                  href="/signup"
                >
                  Sign Up
                </a>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
