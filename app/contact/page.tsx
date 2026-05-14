import { Metadata } from 'next'
import { ContactContent } from '@/components/ContactContent'

export const metadata: Metadata = {
  title: 'Contact | Jaco Moments - Fotograf Nuntă',
  description: 'Contactează Jaco Moments pentru fotografii de nuntă. Trimite un mesaj, WhatsApp sau telefon. Răspund în maxim 24 de ore cu disponibilitatea și oferte.',
  keywords: 'contact fotograf, rezervare fotograf nuntă, telefon fotograf, WhatsApp',
  openGraph: {
    title: 'Contact | Jaco Moments - Fotograf Nuntă',
    description: 'Contactează-ne pentru a discuta despre nunta ta',
    type: 'website',
    locale: 'ro_RO',
  },
}

export default function ContactPage() {
  return <ContactContent />
}
