const User = ({ id, user, isOnline, handleSelectedUser, handleLogOut }) => {
  return (
    <div
      key={id}
      className=" flex justify-around items-center border p-4 m-5 gap-1"
      onClick={() => handleSelectedUser(id)}
    >
      <p>{user.username}</p>
      <div
        className={
          user.isOnline
            ? "rounded-2xl bg-green-800 w-4 h-4"
            : "rounded-2xl bg-gray-800 w-4 h-4"
        }
      >
        {user.isOnline}
      </div>
    </div>
  );
};

export default User;
