'use client';
import React from 'react';

interface Props {
  name?: string;
  avatarUrl?: string;
  role?: string;
  size?: number;
}

export default function AvatarBadge({ name = '?', avatarUrl, role, size = 40 }: Props) {

  if (avatarUrl && avatarUrl.trim() !== '') {
    const isBase64 = avatarUrl.startsWith('data:image') || avatarUrl.length > 200;
    return (
      <img
        src={isBase64 ? avatarUrl : avatarUrl}
        alt="avatar"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--vr-gold)',
          boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        }}
      />
    );
  }


  const color =
    role === 'admin'
      ? '#c0392b'
      : role === 'seller'
      ? '#2980b9'
      : '#8e44ad';

  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        border: '2px solid var(--vr-gold)',
        boxShadow: '0 0 6px rgba(0,0,0,0.5)',
      }}
    >
      {initial}
    </div>
  );
}
