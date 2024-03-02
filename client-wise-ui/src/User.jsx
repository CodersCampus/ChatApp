const User = ({
  id,
  user,
  isOnline,
  handleSelectedUser,
  selectedUser,
  isSelected,
}) => {
  return (
    <div
      key={id}
      className="flex justify-around items-center border p-4 m-5 gap-1"
      onClick={() => handleSelectedUser(user.id)}
      style={{
        border: isSelected && selectedUser === user.id ? "1px solid red" : "",
      }}
    >
      <p>{user.username}</p>
      <div
        className={
          isOnline
            ? "rounded-2xl bg-green-800 w-4 h-4"
            : "rounded-2xl bg-gray-800 w-4 h-4"
        }
      >
        {/* {user.isOnline} */}
      </div>
    </div>
  );
};

export default User;
