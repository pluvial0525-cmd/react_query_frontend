import axios from "axios";

export const userAllGetApi = async () => {
    try {
        const response = await axios.get("http://localhost:3001/user")
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message || "유저 데이터를 가져오는데 실패했습니다.");
    }
}

export const userLoginApi = async (loginUser) => {
    try {
        // 🚨 [핵심 수정] 백엔드 키가 name이므로 쿼리 스트링 조건을 ?name=${loginUser.name}으로 매칭합니다.
        const response = await axios.get(
            `http://localhost:3001/user?name=${loginUser.name}`
        );
        const users = response.data;
        if (!users.length) {
            throw new Error(
                "존재하지 않는 사용자입니다."
            );
        }
        const foundUser = users[0];
        if (foundUser.password !== loginUser.password) {
            throw new Error(
                "비밀번호가 일치하지 않습니다."
            );
        }
        return foundUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const userRegisterApi = async (userObj) => {
    try {
        // 🚨 [핵심 수정] 회원가입 중복 체크 시에도 객체의 .name 속성을 바라보도록 수정합니다.
        const response = await axios.get(`http://localhost:3001/user?name=${userObj.name}`)
        const users = response.data
        if (users.length) {
            throw new Error("이미 존재하는 사용자입니다.");
        }
        const createResponse = await axios.post(`http://localhost:3001/user`, userObj);
        return createResponse.data;
    } catch (error) {
        throw new Error(error.message);
    }
}