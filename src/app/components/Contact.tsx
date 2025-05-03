import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     const res = await fetch(`http://localhost:3000/api/sendMail`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({name,email,message})
     })
     const data = await res.json()
     console.log(data);
     if(res.ok){
      setName('');
      setEmail('');
      setMessage('');
      toast.success('Message sent successfully!');
     }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact">
      <form onSubmit={sendMail}>
        <h1>CONTACT US</h1>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message</label>
          <textarea // Changed from input to textarea for better message input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
    
  );
};

export default Contact;