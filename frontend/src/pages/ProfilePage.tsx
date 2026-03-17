import UserProfile from '../features/user/UserProfile';
import EditProfileForm from '../features/user/EditProfileForm';

const ProfilePage = () => (
  <div className="pb-8">
    <UserProfile />
    <EditProfileForm />
  </div>
);

export default ProfilePage;
