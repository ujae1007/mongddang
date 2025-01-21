# 페이지 라우팅

### **MPA (Multi Page Application)**

서버가 여러 개의 페이지를 가지고 있는 많은 서비스가 사용하는 전통적인 방식 <br>
→ React는 쾌적한 페이지 이동 제공이 어렵기 때문에 이 방식을 사용하지 않는다.

##### 1️⃣ 페이지 이동이 쾌적하지 못하다 <br>

이전 페이지와 이후 페이지에 공통으로 사용되는 요소가 존재하더라도, 페이지 이동 시 원본을 모두 제거하고 새로운 페이지를 그리기 때문에 비효율적으로 페이지를 이동하게된다.

##### 2️⃣ 서버의 부하가 심해진다 <br>

모든 사용자들이 페이지를 이동할때마다 서버에게 새로운 페이지를 요청하게 되기에 동시에 아주 많은 사용자가 접속할 경우 서버가 겪는 부하가 심해진다.

---

### **SPA (Single Page Application)**

React가 사용하는 방식으로 페이지 이동이 매끄럽고 효율적이다. 또한, 다수의 사용자가 접속하더라도 서버의 부하가 심해지지 않는 방식으로 동작한다.

##### 📄 기본적인 틀 역할을 하는 `index.html`과 실제 화면에 렌더링하는 `JS 파일`들로 구성되어있다. <br>

자바스크립트파일에 컴포넌트를 사용하며, 서버에서 요청이 오면 html 파일을 보내준 다음 모든 자바스크립트 파일들을 하나로 묶어(Bundling) 후속으로 전달한다.

##### 🖥️  컴포넌트를 렌더링하고 실행하는 방식으로 페이지를 제공한다. <br>

브라우저에서는 전달받은 자바스크립트 파일들을 직접 실행하고 화면에 렌더링 하게 되면서 페이지가 실제로 렌더링 된다.

새로운 페이지로 이동할 경우에는 해당 페이지에 필요한 컴포넌트들로 화면을 교체하여 아무런 요청도 없이 브라우저가 스스로 페이지를 이동하게 된다.

##### 🖨️ React APP

전달한 Bundle JS File에는 React 문법으로 작성한 모든 것들이 담겨있기 때문에 이 파일을 React App이라 부를 수 있다.

---

### React에서 라우팅 설정

##### 1️⃣ 라이브러리 설치

- 터미널에서 다음 명령어를 입력하여 라이브러리를 설치한다.

  ```
  npm i react-router-dom
  ```

##### 2️⃣ BrowserRouter import

- React App의 모든 컴포넌트들이 현재 브라우저의 주소를 불러와 사용하거나 변화를 감지하는 것이 가능하다.

  ```jsx
  // main.jsx
  import { createRoot } from "react-dom/client";
  import "./index.css";
  import App from "./App.jsx";
  import { BrowserRouter } from "react-router-dom"; // BrowserRouter import

  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  ```

##### 3️⃣  Routes, Route import

- 최상단에 Routes로 감싼 다음, 각각의 컴포넌트들의 경로와 이름을 path, element에 작성한다.
- Routes 안에는 Route 컴포넌트만 작성 가능하다.
- Routes 밖에 작성한 내용은 모든 페이지에 공통으로 출력된다.
