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
      className="flex justify-around items-center rounded-lg shadow-inner shadow-slate-200 border p-4 m-5 gap-1"
      onClick={() => handleSelectedUser(user.id)}
      style={{
        boxShadow:
          isSelected && selectedUser === user.id
            ? "inset 0 0 5px rgba(0, 0, 0, 0.5)"
            : "",
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
