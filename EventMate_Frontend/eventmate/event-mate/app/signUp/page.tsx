"use client";

import SignUpComponent from "@/components/authen/signUp/SignUpComponent";
import SignUpOrganizationComponent from "@/components/authen/signUp/SignUpOrganizationComponent";
import { useState } from "react";


const SignUpPage = () => {
const [isSignUpOrganization, setIsSignUpOrganization] = useState(false);


return (
  <>
  {isSignUpOrganization ?
   <SignUpOrganizationComponent
   setIsSignUpOrganization ={setIsSignUpOrganization} /> : 
   <SignUpComponent 
   setIsSignUpOrganization = {setIsSignUpOrganization}/>}
  </>

);
}

export default SignUpPage;
