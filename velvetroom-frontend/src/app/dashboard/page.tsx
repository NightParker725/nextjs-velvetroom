/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
'use client';
import { motion } from 'motion/react';
import Protected from '../../components/Protected';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
      const { user } = useAuth();

  const Section = ({ title, subtitle, image, actions }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vr-card"
      style={{ textAlign: 'center', padding: '50px', marginTop: 40 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={image.left} style={{ height: 260, opacity: 0.9 }} />
        <div>
          <h1 className="vr-title">{title}</h1>
          <p style={{ color: '#ccc', marginTop: 10 }}>{subtitle}</p>
          <div style={{ marginTop: 30, display: 'flex', gap: 14, justifyContent: 'center' }}>
            {actions.map((a: any, i: number) => (
              <Link key={i} href={a.href} className="vr-btn">{a.label}</Link>
            ))}
          </div>
        </div>
        <img src={image.right} style={{ height: 260, opacity: 0.9 }} />
      </div>
    </motion.div>
  );

  if (!user) {
    return (
      <Section
        title="Bienvenido a la Velvet Room"
        subtitle="Igor dice: Tu destino aún no está escrito... Ingresa y descúbrelo."
        image={{
          left: "https://i.namu.wiki/i/sk4bAusHUteBWR85INVm8gtFdbsUkNjeSz_JX2-5FR0Wm0Z0dJPEQ9t38kEOdTa0n7tLHR6wSCCabe-hvpH1tQ.webp",
          right: "https://i.redd.it/e5d20rbnd9oa1.png"
        }}
        actions={[
          { label: "Iniciar sesión", href: "/login" },
          { label: "Registrarme", href: "/register" }
        ]}
      />
    );
  }

  if (user.role === 'client') {
    return (
      <Section
        title="Bienvenido,  Viajero"
        subtitle="Explora las artesanías, realiza tus compras y continúa tu viaje."
        image={{
          left: "https://samurai-gamers.com/wp-content/uploads/2023/08/sg-persona-5-x-queen-icon.png",
          right: "https://www.pngplay.com/wp-content/uploads/12/Persona-5-Joker-PNG-Photos.png"
        }}
        actions={[
        ]}
      />
    );
  }

  if (user.role === 'seller') {
    return (
      <Section
        title="Bienvenido, Confidente"
        subtitle="Administra tus creaciones para los interesados."
        image={{
          left: "https://64.media.tumblr.com/68dc8304fdfd64d14ef100e058698f70/6ca3342295ac92e5-60/s400x600/f8b06c77487acaa04121c61f6d3c7a28242d1759.png",
          right: "https://i.redd.it/q2mlzhsn3q151.png"
        }}
        actions={[
        ]}
      />
    );
  }

  return (
    <Section
      title="Bienvenido, dueño de tu destino"
      subtitle="Administra el equilibrio de este plano."
      image={{
        left: "https://static.wikitide.net/deathbattlewiki/f/f6/Portrait.elizabeth.png",
        right: "https://i.namu.wiki/i/uBosoH8RGbVrSh3JuwB1X_JTi_lIzcsUcDchyUFRQqgTC2bZEL35zzL6s32FN5SrEPXKnBaF_kbzpbHdZnv23g.webp"      }}
      actions={[
      ]}
    />
  );
}
