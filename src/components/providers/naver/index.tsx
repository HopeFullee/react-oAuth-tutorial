import { SetStateAction, useEffect, useRef } from 'react';
import useScript from '../../../utils/use-script';

declare global {
  interface Window {
    naver: {
      LoginWithNaverId: new (settings: {
        clientId: string;
        callbackUrl: string;
        isPopup: boolean;
        loginButton: unknown;
      }) => {
        init(): void;
        getLoginStatus(callback: (isSuccess: boolean) => void): void;
        user: {
          id: string;
          name: string | undefined;
          email: string | undefined;
          mobile: string | undefined;
        };
      };
    };
  }
}

interface Props {
  setSession: React.Dispatch<SetStateAction<{ provider: string; authId: string }>>;
}

export const NaverAuth = ({ setSession }: Props) => {
  const naverScriptStatus = useScript('https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js');

  useEffect(() => {
    if (naverScriptStatus !== 'ready') return;

    const naver = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_ID ?? '',
      callbackUrl: `${window.location.origin}`,
      isPopup: false,
      loginButton: { color: 'green', type: 1, height: 38 },
    });

    naver.init();

    naver.getLoginStatus((isSuccess) => {
      if (isSuccess) {
        const parsedHash = window.location.hash
          ? window.location.hash
              .replace('#', '')
              .split('&')
              .reduce((result, item) => {
                const [key, value] = item.split('=');
                return { ...result, [key]: value };
              }, {})
          : undefined;

        if (!parsedHash) return;
        if (!('access_token' in parsedHash)) return;
        if (!('token_type' in parsedHash)) return;
        if (!('state' in parsedHash)) return;
        if (!('expires_in' in parsedHash)) return;

        console.log('userInfo', naver.user);

        // TODO 로그인 처리
        setSession({
          provider: 'Naver',
          authId: naver.user.id,
        });
      }
    });
  }, [naverScriptStatus]);

  return <button id="naverIdLogin" className="h-38 w-38 rounded-[50%] overflow-hidden" />;
};
