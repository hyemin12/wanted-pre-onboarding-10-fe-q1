import React from "react";
import { useState } from "react";

const users = [
  {
    username: "blueStragglr",
    password: "1234",
    userInfo: { name: "blueStragglr" },
  },
  { username: "hyeemin", password: "1234", userInfo: { name: "hyeemin" } },
];

//

const login = async (username, password) => {
  // TODO: 올바른 username, password를 입력하면 {message: 'SUCCESS', token: (원하는 문자열)} 를 반환하세요.\

  // username, password가 일치하는 user 찾기
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  return user
    ? {
        message: "SUCCESS",
        token: JSON.stringify({ username: user.username }),
      }
    : null;
};

const getUserInfo = async (token) => {
  // TODO: login 함수에서 받은 token을 이용해 사용자 정보를 받아오세요.
  const parsedToken = JSON.parse(token);

  // parseToken이 없거나, _secret값과 parsedToken값이 없다면 그냥 리턴
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null;

  const loggedUser = users.find((user) => {
    if (user.userInfo.name === parsedToken.user.name) return user;
  });

  return loggedUser ? loggedUser.userInfo : null;
};

const _secret = "1234";

const LoginWithMockAPI = () => {
  // 임의로 만든 token
  const _secret = "1234qwer!@#$";

  const [userInfo, setUserInfo] = useState(null);

  const loginSubmitHandler = async (event) => {
    event.preventDefault();

    // TODO: form 에서 username과 password를 받아 login 함수를 호출하세요.
    const formData = new FormData(event.currentTarget);

    // for (let [key, value] of formData.entries()) console.log(key, value);
    const loginResonse = await login(
      formData.get("username"),
      formData.get("password")
    );
    if (!loginResonse) return;

    const userInfo = await getUserInfo(loginResonse.token);
    if (!userInfo) return;

    setUserInfo(userInfo);
  };

  return (
    <div>
      <h1>Login with Mock API</h1>
      <form onSubmit={loginSubmitHandler}>
        {/* TODO: 여기에 username과 password를 입력하는 input을 추가하세요. 제출을 위해 button도 추가하세요. */}
        <label className="label">
          Username: <input type="text" name="username" />
        </label>

        <label className="label">
          Password: <input type="password" name="password" />
        </label>

        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
      <div>
        <h2>User info</h2>
        {/* TODO: 유저 정보를 보여주도록 구현하세요. 필요에 따라 state나 다른 변수를 추가하세요. */}
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
