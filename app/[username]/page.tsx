import { findUserByUsername, getAllUsers } from '@/lib/db';
import Professional from '@/components/templates/Professional';
import Creative from '@/components/templates/Creative';
import Minimalist from '@/components/templates/Minimalist';

export async function generateStaticParams() {
  try {
    const users = getAllUsers();
    return users.map((user) => ({
      username: user.username,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = findUserByUsername(params.username);

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Usuario no encontrado</h1>
        <p className="text-xl">Lo sentimos, el perfil que estás buscando no existe.</p>
      </div>
    );
  }

  const { username, bio, links, templateId } = user;

  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        return <Professional name={username} bio={bio} links={links} customization={{}} />;
      case 2:
        return <Creative name={username} bio={bio} links={links} customization={{}} />;
      case 3:
        return <Minimalist name={username} bio={bio} links={links} customization={{}} />;
      default:
        return <Professional name={username} bio={bio} links={links} customization={{}} />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {renderTemplate()}
    </div>
  );
}