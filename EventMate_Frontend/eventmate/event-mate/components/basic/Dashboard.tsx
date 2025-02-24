"use client";
import { signIn, useSession } from "next-auth/react";

const Dashboard = () => {
 const {data: session} =   useSession();
 const handleSubmit = async (email: string, password: string) => {

     await signIn("Credentials", {
      email,
      password,
      redirect: false
    });

  };

console.log(session);
 if (!session) { return (

        <div>
        <h1>Dashboard</h1>

        <button onClick={() => signIn("google")}>Sign In</button>
        <button onClick={() => handleSubmit("string@gmail.com","string")}>login</button>
    </div>
        
    )
}else{
    return (
        <div>
        <h1>Dashboard</h1>
        <p>Welcome {session.user?.name || ''}</p>
        <button onClick={() => handleSubmit("string@gmail.com","string")}>login</button>
        
    </div>
    )
}

}
export default Dashboard;