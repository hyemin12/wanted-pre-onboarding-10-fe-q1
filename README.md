# Wanted Pre-onboarding 3월 FE 코스 1일차 실습

> 1일차 실습을 위한 스켈레톤 코드입니다. 강의를 듣고 설명에 따라 실습을 진행해보세요!

## 프로젝트 실행 방법

```bash
  # 패키지매니저를 변경하려면 yarn.lock을 삭제 후 npm install 등을 실행합니다.
  $ yarn && yarn dev
```

## 실습 수행 방법

pages 아래에 있는 LoginWithMockAPI.jsx 파일을 읽고 과제를 수행해 주세요.

\*실습은 제출하지 않습니다.

---

---

# 강의 내용 복습하기

## 로그인이란?

사용자가 시스템에 접근하거나 동작을 수행하는 것을 제어하고 기록하기 위한 컴퓨터 보안 절차

## 로그인이 필요한 이유

1.  사용자 식별

    - 해당 페이지에 접근하는 사용자가 누구인지 구분하기 위해

2.  접근 및 동작 제어  
    2-1. 권한이 없는 자원에 접근하지 않는 구조 만들기

    - 관리자 전용 페이지와 데이터를 일반 유저가 접근하지 못하도록
    - Eg) github repo의 setting 버튼이 관리자를 제외하고는 보여지지 않도록 설정

    2-2. 권한이 없는 자원의 존재를 모르도록 하기

    - 관리자 페이지의 주소를 일반 유저가 직접 입력했을 때 오류 페이지를 보여줌으로써 권한이 없는 페이지&데이터를 숨기기

3.  로그인/로그아웃 만들기

    - 이용자가 입력한 값을 받아오고, 로그인 프로세스가 진행되도록 구조 만들기

4.  인증 정보 관리하기
    - 로그인이 계속 유지될 수 있도록 token을 쿠키, 로컬스토리지, 섹션스토리지에 저장
    - 인증 정보를 저장해두지 않는다면 장바구니에 추가할 때도 로그인을 해야하고, 장바구니로 이동할 때도 로그인을 해야함

## 실제 서비스를 구성하는 페이지들

- 로그인이 필요하지 않은 페이지

```js
const pageWithoutLogin = () => {
  return <div>로그인이 필요 없는 페이지 코드</div>;
};
```

- 로그인이 필요한 페이지

```js
const pageWithLogin = () => {
  const { isLogged, routeToLoginPage } = useLoginState();

  // 로그인이 되지 않은 경우에는 로그인 페이지로 이동
  if (!isLogged) {
    routeToLoginPage();
    // 라우팅 되기 전 잠깐이라도 로그인이 필요한 컨텐츠를 보여주지 않도록 설정
    return <> 로그인 페이지로 이동합니다...</>;
  }

  return <div>로그인이 필요한 페이지 코드</div>;
};
```

### 로그인 여부 확인 로직 모듈화 Authorization

```js
const Authorization = ({ children }) => {
  const { isLogged, routeToLoginPage } = useLoginState();

  // 로그인이 되지 않은 경우에는 로그인 페이지로 이동
  if (!isLogged) {
    routeToLoginPage();
    // 라우팅 되기 전 잠깐이라도 로그인이 필요한 컨텐츠를 보여주지 않도록 설정
    return <> 로그인 페이지로 이동합니다...</>;
  }

  return <>{children}</>;
};
```

## 로그인 화면 만들기

[코드보기](./src/pages/LoginWithMockAPI.jsx)

1. username, password를 입력받을 입력창 만들기

2. 입력한 정보를 받아올 버튼 만들기

3. 로그인 목업 API

4. 유저 정보

```js
import React from "react";
import { useState } from "react";

// 임의로 만든 더미
const users = [
  {
    username: "blueStragglr",
    password: "1234",
    userInfo: { name: "blueStragglr" },
  },
  { username: "hyemin", password: "1234", userInfo: { name: "hyemin" } },
];

// 임의로 만든 token
const _secret = "1234qwer!@#$";

const login = async (username, password) => {
  // TODO: 올바른 username, password를 입력하면 {message: 'SUCCESS', token: (원하는 문자열)} 를 반환하세요.

  // username, password가 일치하는 user 찾기
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  return user
    ? {
        message: "SUCCESS",
        token: JSON.stringify({ username: user.username, secret: _secret }),
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

const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState(null);

  const loginSubmitHandler = async (event) => {
    event.preventDefault();

    // TODO: form 에서 username과 password를 받아 login 함수를 호출하세요.
    const formData = new FormData(event.currentTarget);

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
        <label className="label">
          Username:
          <input type="text" name="username" />
        </label>

        <label className="label">
          Password:
          <input type="password" name="password" />
        </label>

        <button type="submit" value="Submit">
          Submit
        </button>
      </form>
      <div>
        <h2>User info</h2>
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
```

## form Data 받아오는 두 가지 방법

1. `new FormData`를 사용하기

- 사용자가 입력할 때마다 렌더링이 발생하지 않음
- 단순한 값을 받아올 때 주로 사용
- 실시간으로 제어하기 어려움
- .get(name)으로 값 가져와서 사용

2. `useState` 사용하기

- 사용자가 입력할 때마다 렌더링이 발생
- 실시간으로 제어할 수 있음 (특수문자 등)
- 부모컴포넌트 전체가 렌더링돼서 부담될 때는 input만 따로 컴포넌트로 만들고 input 컴포넌트 안에서 useState 사용해서 전체 렌더링 막기

## 느낀점

formData를 이용해 제출된 값을 가져올 수 있다는 점을 배웠고,  
loginSubmitHandler, 로그인 함수까지는 작성을 했으나 getUserInfo 함수는 왜 사용되는지 무슨 역할을 하는지 알지 못하여 작성하지 못하였다. getUserInfo()가 무슨 역할을 하는지 따로 공부해야겠다.
