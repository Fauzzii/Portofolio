import { useTextScramble } from '../hooks/useTextScramble';

export default function ScrambleText({ text, duration = 600, className = '', ...rest }) {
  const [displayText, trigger, reset] = useTextScramble(text, duration);
  
  return (
    <span
      className={className}
      onMouseEnter={trigger}
      onMouseLeave={reset}
      style={{ display: 'inline-block' }}
      {...rest}
    >
      {displayText}
    </span>
  );
}
