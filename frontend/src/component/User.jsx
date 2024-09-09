import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import "../style/user.css";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";


const User = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log(user.id);

  return (
    <div>
      <button>
        <Link to="/interview">Create Interview</Link>
      </button>

      <div>
        <p>{user.fullName}</p>
        <p>{user.primaryEmailAddress.emailAddress}</p>
        <img src={user.imageUrl} alt="" />
        <SignOutButton>
          <button>sign out</button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default User;
