import Layout from "../components/Layout";
import FriendRequestForm from "../components/FriendRequestForm";
import FriendRequestList from "../components/FriendRequestList";
import FriendList from "../components/FriendList";

export default function FriendsPage() {
  return (
    <Layout>
      <FriendRequestForm />
      <h5 className="fs-5 mt-3 fw-bold">Pending Friend Requests</h5>
      <FriendRequestList />
      <h5 className="fs-5 mt-3 fw-bold">Friend List</h5>
      <FriendList />
    </Layout>
  );
}
