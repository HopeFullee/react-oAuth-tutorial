import { SetStateAction, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

interface Props {
  setSession: React.Dispatch<SetStateAction<{ provider: string; authId: string }>>;
}

export const KakaoAuth = ({ setSession }: Props) => {
  const [searchParams] = useSearchParams();

  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_KEY ?? '';
  const CLIENT_SECRET = process.env.REACT_APP_KAKAO_SECRET ?? '';
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const loginWithKakao = async (kakaoAuthCode: string) => {
    try {
      const uri = 'https://kauth.kakao.com/oauth/token';
      const body = qs.stringify({
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: kakaoAuthCode,
      });
      const headers = { 'Content-type': 'application/x-www-form-urlencoded' };

      // 발급받은 kakaoAuthCode 로 토큰 요청
      const tokenRes = await axios.post(uri, body, { headers: headers });

      // 토큰을 성공적으로 발급 받았다면 실행
      if (tokenRes.status === 200) {
        const { access_token } = tokenRes.data;
        const uri = 'https://kapi.kakao.com/v2/user/me';
        const headers = {
          Authorization: `Bearer ${access_token}`,
          'Content-type': 'application/x-www-form-urlencoded',
        };

        // 발급받은 토큰으로 회원정보 요청 (예: 닉네임, 회원 고유 ID 등등..)
        const userInfo = await axios.post(uri, {}, { headers: headers });

        // 요청한 회원정보로 로그인 핸들링
        return userInfo;
      }
    } catch (err) {
      console.log('로그인 실패', err);
    }
  };

  useEffect(() => {
    // redirect 이후 kakao 에서 code 받아옴
    const kakaoAuthCode = searchParams.get('code');
    if (!kakaoAuthCode) return;

    loginWithKakao(kakaoAuthCode).then((userInfo) => {
      // 로그인 핸들링
      console.log('use effect', userInfo);
    });
  }, []);

  return (
    <button
      className="h-38 w-38 rounded-[50%] bg-[url('https://cs.kakao.com/images/icon/img_kakaocs.png')] bg-center bg-cover"
      onClick={() => (window.location.href = kakaoURL)}
    ></button>
  );
};
