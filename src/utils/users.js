const users = [];
const passwords = [];

// Add User
const addUser = ({ id, username, roomName, password }) => {
  username = username.trim().toLowerCase();
  roomName = roomName.trim().toLowerCase();

  if (!username || !roomName) {
    return {
      error: "User, Room name or Password is required",
    };
  }

  const existUserName = users.find(
    (user) => user.roomName === roomName && user.username === username
  );

  if (existUserName) {
    return {
      error: "User is in use!",
    };
  }

  const isMatchPassword = passwords.findIndex(
    (pass) => pass.password === password && pass.roomName === roomName
  );

  const isMatchRoom = passwords.findIndex((pass) => pass.roomName === roomName);

  if (passwords.length === 0 || isMatchPassword !== -1) {
    const user = {
      id,
      username,
      roomName,
    };

    const pass = {
      password,
      roomName,
    };

    users.push(user);
    passwords.push(pass);

    return { user };
  } else if (passwords.length !== 0 && isMatchRoom === -1) {
    const user = {
      id,
      username,
      roomName,
    };

    const pass = {
      password,
      roomName,
    };

    users.push(user);
    passwords.push(pass);

    return { user };
  } else {
    return {
      error: "Password is incorrect",
    };
  }
};

// Remove User

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get User
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// Get All Users
const getAllUsers = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.roomName === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getAllUsers,
};
