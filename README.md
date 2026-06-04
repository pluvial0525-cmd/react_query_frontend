refc
rafce
node-modules 다시 설치 : npm install
server 띄우기 : npm run dev
cd server  ->  json-server --watch db.json --port 3001

[git 처음 설정]
git init
git add README.md
git commit -m "start frontend"
git branch -M main
git remote add origin https://github.com/pluvial0525-cmd/frontend.git
git push -u origin main

[git저장]
git add .
git commit -m ""
git push -u origin main



router : npm install react-router-dom
CSS(스타일) : npm install styled-components
아이콘: npm install react-icons
redux: npm install react-redux @reduxjs/toolkit
json-server(RestfulAPI) : npm install -g json-server
api 라이브러리: npm install axios
query 라이브러리: npm install @tanstack/react-query

api 설정(주소띄우는)
1. npm install -g json-server
2. cd server
3. json-server --watch db.json --port 3001


reducer
dispatch: 함수를 실행하는 함수
action: 전체 object 인수
action.type: 함수의 타입 (어떤함수인지)
action.payload: state를 변화시킬수 있는 인수

useState => userReducer => useContext => redux(slice, query)

context: state, 내부함수(reducers) 관리
redux: state, 내부함수(reducers), 외부함수(extraReducers: Api) 관리

[Restful Api]
get 전체 방식: url => retrun: 테이블받음(json)
get 하나 데이터: url + id => retrun: 오브젝트(row행)받음
post 방식: url + object => retrun: object(잘 받았다고)
put 방식: url+id, object => return: object(잘 넣었다고)
delete 방식: url + id => retrun: id (아이디 잘 지웠다고)




