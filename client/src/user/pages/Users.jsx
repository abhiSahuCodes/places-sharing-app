import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Tom Grace",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
