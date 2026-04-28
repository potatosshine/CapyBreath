import UserProfile from '../features/user/UserProfile';
import EditProfileForm from '../features/user/EditProfileForm';
import PageShell from '../components/ui/PageShell';

const ProfilePage = () => (
  <PageShell>
    <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-6">
      <UserProfile />
      <EditProfileForm />
    </main>
  </PageShell>
);

export default ProfilePage;
