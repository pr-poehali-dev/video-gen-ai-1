import ContactForm from '@/components/ContactForm';

interface ContactsSectionProps {
  contactSection: {
    ref: (node?: Element | null) => void;
    isVisible: boolean;
  };
}

const ContactsSection = ({ contactSection }: ContactsSectionProps) => {
  return (
    <section id="contacts" className="py-20 px-6" ref={contactSection.ref}>
      <div className="container mx-auto max-w-4xl">
        <div className={`text-center mb-12 ${contactSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-flicker">
            Контакты
          </h2>
          <p className="text-lg sm:text-xl text-cyan-100/60 px-4">Свяжитесь с нами по любым вопросам</p>
        </div>
        <div className={contactSection.isVisible ? 'animate-scale-in' : 'opacity-0'}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
