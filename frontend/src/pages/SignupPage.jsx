import { useEffect } from 'react';
import { QuestionnaireModal } from './LandingPage';

export default function SignupPage() {
  useEffect(() => {
    document.title = 'Sign Up | The Becoming';
  }, []);

  return <QuestionnaireModal isOpen={true} onClose={() => window.location.href = '/'} />;
}
