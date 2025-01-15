
import { FormEvent, useState } from "react";
import { passwordReset } from "../authentication/firebase";

function PasswordForgot() {
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState(false)

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await passwordReset(email);
      setEmailMessage(true);
    } catch (error:any) {    
      if (error.code === 'auth/user-not-found') {
        alert('User not found, try again!')
        setEmail('')
      }
    }
  };
  
  return (
    <div>
      {
        emailMessage ?
        <h3>The Email has been sent; Check your Inbox!</h3> : 
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="name@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <button type='submit'>Reset Your Password</button>
          </div>
        </form>
      }
    </div>
  )
}

export default PasswordForgot