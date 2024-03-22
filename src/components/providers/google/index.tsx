import { SetStateAction, useEffect, useRef } from 'react';
import useScript from '../../../utils/use-script';

interface Props {
  setSession: React.Dispatch<SetStateAction<{ provider: string; authId: string }>>;
}

export const GoogleAuth = ({ setSession }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const googleScriptStatus = useScript('https://accounts.google.com/gsi/client');

  useEffect(() => {
    if (googleScriptStatus !== 'ready') return;

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_ID ?? '',
      login_uri: window.location.origin, // 로그인을 시도하는 페이지가 정해져 있다면 대체해주세요. 예) /login페이지에서만 로그인을 시도한다면 `${window.location.origin}/login`
      callback: (response) => {
        const userInfo = JSON.parse(window.atob(response.credential.split('.')[1].replace('-', '+').replace('_', '/')));

        console.log(userInfo);
        // 로그인 핸들링
        setSession({
          provider: 'Google',
          authId: userInfo.sub,
        });
      },
    });

    if (!buttonRef.current) return;

    // 스타일을 변경할 수 있습니다.
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'icon',
      shape: 'circle',
      theme: 'filled_blue',
    });
  }, [googleScriptStatus]);

  return <button ref={buttonRef} />;
};
