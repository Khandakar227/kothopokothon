import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react"

function LoginForm() {
    const [user, setUser] = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function onLogin(e:FormEvent) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          };
          if(isLogin) {
              setLoading(true);
              fetch('/api/login', options)
                .then(response => response.json())
                .then(response => {
                    if(response.error) {alert(response.error);return;}
                    setLoading(false);
                    localStorage.setItem('token', response.data.token);
                    setUser(response.data.userInfo);
                    router.push("/dashboard");
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                });
        } else {
            if(data.password != data.confirm_password) {
                alert("Confirm password does not match.")
                return;
            }
            setLoading(true);
            fetch('/api/signup', options)
                .then(response => response.json())
                .then(response => {
                    if(response.error) {alert(response.error);return;}
                    setLoading(false);
                    setIsLogin(true);
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                });
        }
        console.log(data)
    }

    return (
        <div className="p-4 rounded-md shadow mx-auto max-w-xl bg-white">
            <form onSubmit={onLogin}>
                <h1 className="text-3xl font-semibold pb-4">{isLogin ? 'Login' : 'Create Account'}</h1>
                <input type="text" name="name" id="name" placeholder="Username" required className="my-2 border w-full shadow rounded-md outline-none px-4 py-2" />
                <input type="password" name="password" id="password" placeholder="Password" required className="my-2 border w-full shadow rounded-md outline-none px-4 py-2" />
                {
                    !isLogin && (<input type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" required className="my-2 border w-full shadow rounded-md outline-none px-4 py-2" />)
                }
                <button disabled={loading} className="my-4 px-4 py-2 bg-gray-950 rounded-md text-white">{loading ? "Loading..." : isLogin ? 'Login' : 'Create'}</button>
            </form>
            <p>
                <button disabled={loading} className="hover:underline" onClick={() => setIsLogin(!isLogin)}>{!isLogin ? 'Have an account? Login now' :'Create Account?'}</button>
            </p>
        </div>
    )
}

export default LoginForm