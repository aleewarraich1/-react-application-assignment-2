import { useState, type FormEvent } from 'react';
import { useToast } from '../../context';

export default function Contact() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const contacts = JSON.parse(localStorage.getItem('aiqr_contacts') || '[]');
    contacts.push({ name, email, subject, message, date: new Date().toLocaleString() });
    localStorage.setItem('aiqr_contacts', JSON.stringify(contacts));
    setSubmitted(true);
    showToast('Message sent successfully!', 'success');
  };

  const handleSendAnother = () => {
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setSubmitted(false);
  };

  return (
    <main className="container">
      <div className="page-header">
        <h1>Get in Touch</h1>
        <div className="section-divider"></div>
        <p>Have questions about enterprise plans, custom integrations, or just want to say hello? We'd love to hear from you.</p>
      </div>

      <div className="contact-layout">
        <div className="glass-panel">
          <h3><i className="fa-solid fa-headset"></i> Contact Information</h3>
          <div className="contact-info-item">
            <div className="icon-wrap"><i className="fa-solid fa-envelope"></i></div>
            <div><h4>Email</h4><p>support@aiqrgen.com</p></div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap"><i className="fa-solid fa-phone"></i></div>
            <div><h4>Phone</h4><p>+1 (555) 012-3456</p></div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap"><i className="fa-solid fa-location-dot"></i></div>
            <div><h4>Office</h4><p>123 Innovation Drive, Tech City, CA 94000</p></div>
          </div>
          <div className="contact-info-item">
            <div className="icon-wrap"><i className="fa-solid fa-clock"></i></div>
            <div><h4>Business Hours</h4><p>Mon – Fri: 9:00 AM – 6:00 PM (PST)</p></div>
          </div>
        </div>

        <div className="glass-panel">
          <h3><i className="fa-solid fa-paper-plane"></i> Send a Message</h3>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="c-name"><i className="fa-solid fa-user"></i> Your Name</label>
                <input type="text" id="c-name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="c-email"><i className="fa-solid fa-envelope"></i> Your Email</label>
                <input type="email" id="c-email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="c-subject"><i className="fa-solid fa-tag"></i> Subject</label>
                <select id="c-subject" value={subject} onChange={e => setSubject(e.target.value)} required>
                  <option value="">Select a topic...</option>
                  <option value="enterprise">Enterprise Plan Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-message"><i className="fa-solid fa-message"></i> Message</label>
                <textarea id="c-message" placeholder="Tell us how we can help..." value={message} onChange={e => setMessage(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                <i className="fa-solid fa-paper-plane"></i> Send Message
              </button>
            </form>
          ) : (
            <div className="success-msg show">
              <i className="fa-solid fa-circle-check"></i>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              <button onClick={handleSendAnother} className="btn btn-outline">
                <i className="fa-solid fa-rotate-left"></i> Send Another
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
