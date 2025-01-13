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