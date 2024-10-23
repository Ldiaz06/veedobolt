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

export default function Creative({ name, bio, links, customization }: ProfileProps) {
  const { primaryColor, secondaryColor, fontFamily } = customization;

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-lg" style={{ 
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      fontFamily
    }}>
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: secondaryColor }}>{name}</h1>
      <p className="text-xl mb-6" style={{ color: secondaryColor }}>{bio}</p>
      <div className="grid grid-cols-2 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-4 rounded-full text-center transition-colors"
            style={{ backgroundColor: secondaryColor, color: primaryColor }}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}