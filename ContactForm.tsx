import React, { useState } from &apos;react&apos;;

const ContactForm = () => {
    const [firstName, setFirstName] = useState(&apos;&apos;);
    const [lastName, setLastName] = useState(&apos;&apos;);
    const [email, setEmail] = useState(&apos;&apos;);
    const [message, setMessage] = useState(&apos;&apos;);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email) {
            alert(&apos;Please fill in all required fields.&apos;);
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
                    <input type=&quot;text&quot; value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </label>
                <label>
                    Last name*
                    <input type=&quot;text&quot; value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </label>
                <label>
                    Email*
                    <input type=&quot;email&quot; value={email} onChange={(e) => setEmail(e.target.value)} required />
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