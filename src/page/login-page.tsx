import { useState } from 'react';
import { GoogleAuth, KakaoAuth, NaverAuth } from '../components/providers';

const LoginPage = () => {
  const [sessionInfo, setSessionInfo] = useState({
    provider: '',
    authId: '',
  });

  return (
    <section className="flex-col-center gap-80 w-full">
      <p className="text-28 text-[#222222] font-medium mt-120">Login Page</p>
      <div className="flex-center gap-20">
        <GoogleAuth setSession={setSessionInfo} />
        <NaverAuth setSession={setSessionInfo} />
        <KakaoAuth setSession={setSessionInfo} />
      </div>
      {sessionInfo.provider && (
        <div className="flex-col-center max-w-400 w-full gap-10">
          <div className="flex w-full gap-5">
            <p className="text-gray-500 w-80 text-right text-18">Provider :</p>
            <p className="text-18">{sessionInfo.provider}</p>
          </div>
          <div className="flex w-full gap-5">
            <p className="text-gray-500 w-80 shrink-0 text-right text-18">Auth ID :</p>
            <p className="text-18 break-all">{sessionInfo.authId}</p>
          </div>
        </div>
      )}
      {!sessionInfo.provider && <p className="text-18 text-gray-500">OFFLINED</p>}
    </section>
  );
};

export default LoginPage;
