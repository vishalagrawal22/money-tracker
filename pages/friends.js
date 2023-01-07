import Layout from "../components/Layout";
import FriendRequestForm from "../components/FriendRequestForm";
import FriendRequestList from "../components/FriendRequestList";
import FriendList from "../components/FriendList";

export default function FriendsPage() {
  return (
    <Layout>
      <FriendRequestForm />
      <FriendRequestList />
      <FriendList />
    </Layout>
  );
}
