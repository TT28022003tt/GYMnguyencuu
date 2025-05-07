import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/sendMail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
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
    <section className="w-[80%] min-h-[60vh] flex justify-center items-center mx-auto mb-[150px] mt-[300px] px-5 py-10 bg-gradient-to-b from-[#ffb350] to-[#e1ffea22]">
      <form
        onSubmit={sendMail}
        className="bg-white shadow-lg rounded-lg w-full max-w-[650px] text-black p-10 flex flex-col gap-10"
      >
        <h1 className="text-2xl font-bold text-center text-[#171717]">CONTACT US</h1>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[#171717]">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-[20px] py-2 px-1 border-b border-[#171717] bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[#171717]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-[20px] py-2 px-1 border-b border-[#171717] bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-[#171717]">Message</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white text-black p-2 text-[18px] resize-none border border-[#171717] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0095ff] hover:bg-[#0267af] transition text-white py-2 px-4 text-[20px] font-medium flex justify-center items-center gap-3 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

export default Contact;