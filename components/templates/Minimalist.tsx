import React from 'react';

interface ProfileProps {
  name: string;
  bio: string;
  links: { name: string; url: string }[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function Minimalist({ name, bio, links, customization }: ProfileProps) {
  const { primaryColor, secondaryColor, fontFamily } = customization;

  return (
    <div className="max-w-2xl mx-auto p-8" style={{ backgroundColor: secondaryColor, fontFamily }}>
      <h1 className="text-2xl font-light mb-4" style={{ color: primaryColor }}>{name}</h1>
      <p className="text-md mb-6" style={{ color: primaryColor }}>{bio}</p>
      <div className="space-y-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-colors"
            style={{ color: primaryColor }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}