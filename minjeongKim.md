# 📌 JavaScript

### JavaScript + HTML + CSS       ⇒     Web Page

<b>HTML</b>
- 요소들의 내용, 배치, 모양을 정하기 위해 사용하는 언어
- 색상이나 디자인 등의 수정은 불가

<b>CSS</b>
- 요소들의 색상, 크기 등의 스타일을 설정할 수 있음

<b>JavaScipt</b>
- 웹 내부에서 발생하는 다양한 기능을 만들 수 있는 언어
- 웹을 움직이게 하는 “웹의 근육”이라고 표현 할 수 있음

---

### JavaScipt의 실행 원리

- JavaScript는 JavaScript 엔진에 의해 실행된다.
- 엔진은 게임 구동기, JavaScript는 게임이라고 이해!
- JavaScript 엔진은 브라우저에 기본 탑재되어 있음
- 브라우저를 이용하면 간단한 JavaScript 코드 직접 실행해 볼 수 있음

---

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/7d836235-8445-41e2-9eb2-7a14a48b1ae2/image.png)

### 객체(Object)란?
- 원시 타입이 아닌 객체 타입의 자료형
- 여러가지 값을 동시에 저장할 수 있는 자료형

```jsx
let person = {
	name: "이정환",
	nickname: "winterwoord",
	age: 27,
	location: "목동",
}
```

---

### Truthy  & Falsy 
- 참이나 거짓을 의미하지도 않는 값도, 조건문 내에서 참이나 거짓으로 평가하는 특징
- JavaScript의 모든 값을 Truthy하거나 Falsy함
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/49173ff5-1a5d-47b2-a3c7-cab1306e3442/image.png)
    

---

### 원시타입 & 객체 타입
- 원시타입 : Number, String, Boolean 등 값 자체로써 변수에 저장되고 복사됨. 불변값이다(메모리 값 수정 X)
- 객체타입 : Object, Array, Function 등 참조값을 통해 변수에 저장되고 복사됨. 가변값이다(메모리 값 수정 O)

---

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/3a643c3f-6b3b-44bb-83c6-fa50c8580991/image.png)

---

### JSON.stringify 
- 객체를 문자열로 변환하여 비교. 깊은 비교시 이용

```jsx
// 얕은 비교
// 참조값을 기준을 비교
o1 === o2

//깊은 비교
// 객체를 문자열로 변환하여 비교
// JSON.Stringify(o1) === JSON.Stringify(o2) 
```

---

### 비동기
- 작업을 순서대로 처리하지 않음
- 비동기 작업들은 자바스크립트 엔진이 아닌 Web APIs 에서 실행 됨
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/6283eda9-8977-4e4b-a551-307055ccbc58/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/d6cc2641-727a-4490-b29a-e3daba3cdc31/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/9bd0ddb4-12d5-4dfe-a82f-309c47e59157/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/7ab31e93-55b0-4f49-8554-c0d836294a5a/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/087e03fe-3662-46ef-a683-df2aa31c79ee/image.png)
    

---

### Promise 
- 비동기 작업을 효율적으로 처리할 수 있도록 도와주는 자바스크립트의 내장 객체
- promise는 비동기 작업을 감싸는 객체

<Promise의 효능>

1. 비동기 작업 실행
2. 비동기 작업 상태 관리
3. 비동기 작업 결과 저장
4. 비동기 작업 병렬 실행
5. 비동기 작업 다시 실행 
6. 기타 등등,,,

<Promise의 3가지 상태>

1. 대기 (Pretending) - 아직 작업이 완료되지 않은 상태
2. 성공 (Fulfilled) - 비동기 작업이 성공적으로 마무리 된 상태
3. 실패 (Rejected) - 비동기 작업이 실패한 상태

# 📌Node. js

- JavaScript 실행 환경(Run Time), 구동기
- JavaScript 엔진으로 빌드된 JavaScript 런타임
- 웹 페이지 내부에 필요한 아주 단순한 기능만을 개발하기 위해 만들어짐

- 프로젝트  - 특정 목적을 갖는 프로그램 단위
- 패키지 - Node.js에서 사용하는 프로그램의 단위

### 모듈 시스템

- 모듈을 생성하고, 불러오고, 사용하는 등의 모듈을 다루는 다양한 기능을 제공하는 시스템
- 모듈이란 ?
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/a4df1484-2d35-43a5-b0df-8b1d9667c18f/image.png)
    

### 라이브러리

- 프로그램을 개발할 때 필요한 다양한 기능들을 미리 만들어 모듈화 해 놓은 것

# 📌 React.js

- Meta(Facebook)이 개발한 오픈소스 JavaScript 라이브러리
- 대규모 웹 서비스의 UI를 더 편하게 개발하기 위해 만들어진 기술
- ex. 넷플릭스, 페이스북, 인스타그램, 노션 등

### React의 기술적인 특징

1. **컴포넌트를 기반으로 UI를 표현한다.** 
- 컴포넌트(component) : 구성요소. 화면을 구성하는 요소, UI를 구성하는 요소

2. **화면 업데이트 구현이 쉽다.**
- 업데이트 : 사용자의 행동(클릭, 드래그)에 따라 웹 페이지가 스스로 모습을 바꿔 상호작용 하는 것. 

- 선언형 프로그래밍 : 과정은 생략하고 목적만 간결히 명시하는 방법. 
⇒ 목적만 깔끔하게 명시. 코드가 간결함. ex. React
⇒업데이트를 위한 복잡한 동작을 직접 정의할 필요 없이 특정 변수의 값을 바꾸는 것 만으로도 화면을 업데이트 시킬 수 있다.

- 명령형 프로그래밍 : 목적을 이루기 위한 모든 일련의 과정을 설명하는 방식.  
⇒ 모든 과정을 하나 하나 모두 설명. 코드가 길고 복잡함. ex. JS

- 선언형 프로그래밍 예시
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/568d4041-5a0d-4aa7-a031-6e542e2908dc/image.png)
    
3. **화면 업데이트가 빠르게 처리된다.** 
- 브라우저의 렌더링 과정
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/f2c1d087-0938-4145-b5d6-80c850c76be3/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/2bf1c65b-5c08-4302-bffe-c87ae2ac4789/image.png)
    
    -Render Tree : 웹페이지의 청사진
    - Layout : 요소의 배치를 잡는 작업
    - Painting : 실제로 화면에 그려내는 과정 
    
- JavaScript가 DOM을 수정하면 업데이트가 발생한다.
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/3ef2e537-68c2-444b-ad68-fc95cce9a7f7/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/6cc1321b-df73-4093-9016-fd373026d4bc/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/5d4513eb-2d7a-42e9-853a-0013fdb88809/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/fe4ba05f-dda5-40e2-8299-0e8b8de478bd/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/da4302f2-053b-474a-95c4-a96c7356276a/image.png)
    
    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/51cfbe8a-1b1b-41cc-9eea-d88acc71bbf6/image.png)
    

- Virtual DOM ?
- DOM을 자바스크립트 객체로 흉내낸 것으로 일종의 복제판.
- React는 업데이트가 발생하면 실제 DOM을 수정하기 전에 이 가상의 복제판 DOM에 먼저 반영.

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/cf7bdd9f-c174-47ee-be4d-173fd69b2f3f/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/c0be2b02-ab7a-49a2-b8d1-22f1aad1c736/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/f9c049cb-99bc-4dba-b6dc-75fd826860fe/image.png)

### Vite

: 차세대 프론트엔드 개발 툴 
기본 설정이 적용된 React App 생성 가능

1. React App 생성(with Vite) 
- npm create vite@latest
2. React App 가동 
- npm run dev
3. React App 접속
- https://localhost:5173/

### JSX

: JavaScript Extensions , 확장된 자바스크립트의 문법

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/b21e04b6-536d-4dd2-8a20-7dbb66fd1296/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/db5b9b9c-54be-4d58-b3f3-9c0f1abd3738/image.png)

### Props

: 컴포넌트에 값 전달

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/58363f9d-30f7-434c-aa78-46a3ac5e6b32/9728b12b-345e-4ac9-bd94-9506138d5248/image.png)

### Event Handling

: 웹 내부에서 발생하는 사용자의 행동
ex. 버튼 클릭, 메세지 입력, 스크롤 등등 처리 할 수 있는 것

⇒ 이벤트가 발생했을 때 그것을 처리하는 것

### 합성 이벤트

: 모든 웹 브라우저의 이벤트 객체를 하나로 통일한 형태