import React, { useState } from 'react';

const Register = () => {
  const [usernameReg, setUsernameReg] = useState('');
  const [displayNameReg, setDisplayNameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [phoneNumberReg, setPhoneNumberReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [roleReg, setRoleReg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: usernameReg,
      displayName: displayNameReg,
      password: passwordReg,
      role: roleReg,
      phoneNo: phoneNumberReg,
      email: emailReg,
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration Successful!');
        console.log('User registered successfully.');
        setUsernameReg('');
        setDisplayNameReg('');
        setPasswordReg('');
        setPhoneNumberReg('');
        setEmailReg('');
        setRoleReg('');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.log(error);
      alert('Error');
    }
  };

  return (
    <div className="App">
      <div className="reg">
        <h1>Register an Account</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={usernameReg}
            onChange={(e) => setUsernameReg(e.target.value)}
            required
          />
          <label>Display Name</label>
          <input
            type="text"
            value={displayNameReg}
            onChange={(e) => setDisplayNameReg(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={passwordReg}
            onChange={(e) => setPasswordReg(e.target.value)}
            required
          />
          <label>Role</label>
          <select
            value={roleReg}
            onChange={(e) => setRoleReg(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumberReg}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPhoneNumberReg(value);
              }
            }}
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={emailReg}
            onChange={(e) => setEmailReg(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
