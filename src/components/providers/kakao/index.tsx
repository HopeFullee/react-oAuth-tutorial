import { SetStateAction, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface Props {
  setSession: React.Dispatch<SetStateAction<{ provider: string; authId: string }>>;
}

export const KakaoAuth = ({ setSession }: Props) => {
  const [searchParams] = useSearchParams();

  const REST_API_KEY = `${process.env.REACT_APP_KAKAO_REST_KEY ?? ''}`;
  const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL}`;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    // redirect 이후 kakao 에서 code 받아옴
    const kakaoAuthCode = searchParams.get('code');
    if (!kakaoAuthCode) return;

    const grantType = 'authorization_code';

    // 발급받은 code 로 access 토큰 요청
    axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${kakaoAuthCode}`,
        {},
        { headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' } }
      )
      .then((res: any) => {
        const { access_token } = res.data;

        // 발급받은 access 토큰으로 회원정보 요청 (예: 닉네임, 회원 고유 ID 등등..)
        axios
          .post(
            `https://kapi.kakao.com/v2/user/me`,
            {},
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
              },
            }
          )
          .then((res: any) => {
            console.log('카카오 로그인', res);
            setSession({
              provider: 'Kakao',
              authId: res.data.id,
            });
          });
      })
      .catch((Error: any) => {
        console.log(Error);
      });
  }, []);

  return (
    <button
      className="h-38 w-38 rounded-[50%] bg-[url('https://cs.kakao.com/images/icon/img_kakaocs.png')] bg-center bg-cover"
      onClick={() => (window.location.href = kakaoURL)}
    ></button>
  );
};
