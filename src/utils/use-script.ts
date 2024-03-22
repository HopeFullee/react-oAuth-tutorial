import { useEffect, useState } from 'react';

/**
 * loading: 로드중
 * ready: 사용가능
 * error: 에러
 */
export type UseScriptState = 'loading' | 'ready' | 'error';

type Option = {
  integrity?: string;
  crossorigin?: string;
};

export default function useScript(src: string, additionalProps?: Option): UseScriptState {
  const [script, setScript] = useState<UseScriptState>('loading');

  useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');

      if (additionalProps?.crossorigin) script.setAttribute('crossorigin', 'anonymous');
      if (additionalProps?.integrity) script.integrity = additionalProps.integrity;

      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script?.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      setScript(script.getAttribute('data-status') as UseScriptState);
    }

    const setStateFromEvent = (event: Event) => {
      setScript(event.type === 'load' ? 'ready' : 'error');
    };

    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [additionalProps?.crossorigin, additionalProps?.integrity, src]);

  return script;
}
