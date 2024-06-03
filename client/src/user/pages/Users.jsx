import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users");

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setUsers(responseData.users);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError(error.message || "Something went wrong");
      }
    };
    fetchUsers();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && <UsersList items={users} />}
    </>
  );
};

export default Users;
