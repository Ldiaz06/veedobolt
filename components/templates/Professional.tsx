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

export default function Professional({ name, bio, links, customization }: ProfileProps) {
  const { primaryColor, secondaryColor, fontFamily } = customization;

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-lg" style={{ backgroundColor: secondaryColor, fontFamily }}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>{name}</h1>
      <p className="text-lg mb-6" style={{ color: primaryColor }}>{bio}</p>
      <div className="space-y-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-4 rounded text-center transition-colors"
            style={{ backgroundColor: primaryColor, color: secondaryColor }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}