import React, { useState } from 'react';

const ContactForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields.');
            return;
        }

        const mailto = `mailto:paxymekventures@gmail.com?subject=Contact Form Submission&body=First Name: ${firstName}%0D%0ALast Name: ${lastName}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
        window.location.href = mailto;
    };

    return (
        <div>
            <h1>Fill in the form below to be called back by one of our educational advisors and join the course of your choice.</h1>
            <p>Once we receive your request, an advisor will call you back shortly to discuss about your project and help you find the best course adapted to your background and goals.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    First name*
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
                <label>
                    Last name*
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </label>
                <label>
                    Email*
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Message
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ContactForm;