import { redirect } from "next/navigation";

export default function Login (loginsetter) {
    
    const loginform = () => {
        redirect("/userpage", "replace")
    }
    const cancelform = () => {
        redirect("/", "replace");
    }
    return(
        <div className="login">
            <h2>Sign In</h2>
            <form className="loginform">
                <input type="text" placeholder={"Username..."}></input>

                <input type="text" placeholder={"Password..."}></input>
                <button onClick={loginform} className="loginButtons">Submit</button>
                <button onClick={cancelform} className="loginButtons">Cancel</button>
            </form>
        </div>
    )
}