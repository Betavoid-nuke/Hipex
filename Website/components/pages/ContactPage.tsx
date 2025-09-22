const ContactPage = () => {
    return (
        <section id="contact" className="page" style={{ display: 'block' }}>
             <div className="container mx-auto px-4 max-w-4xl text-center">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                     Get in <span className="gradient-text">Touch</span>
                 </h2>
                 <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">Whether you're a potential customer, a partner, or an investor, we'd love to hear from you.</p>
                 <form className="space-y-6">
                     <div>
                         <input type="text" placeholder="Your Name" className="modal-form-input w-full" />
                     </div>
                     <div>
                         <input type="email" placeholder="Email Address" className="modal-form-input w-full" />
                     </div>
                     <div>
                         <select defaultValue="" className="modal-form-select w-full">
                             <option value="" disabled>Select an option...</option>
                             <option value="general">General Inquiry</option>
                             <option value="investor">Investor Relations</option>
                             <option value="support">Support</option>
                         </select>
                     </div>
                     <div>
                         <textarea placeholder="Your Message" rows={6} className="modal-form-textarea w-full"></textarea>
                     </div>
                     <div>
                         <button type="submit" className="primary-button w-full">
                             Send Message
                         </button>
                     </div>
                 </form>
             </div>
        </section>
    );
};

export default ContactPage;