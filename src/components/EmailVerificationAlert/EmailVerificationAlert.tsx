import Alert from 'react-bootstrap/Alert';

type VerifiedProp = {
  verified: boolean
};

const EmailVerificationAlert = ({ verified }: VerifiedProp) => {
  if (!verified) {
    return (
      <div>
        <Alert variant = "primary" dismissible>
          <Alert.Heading>You haven't verified your email!</Alert.Heading>
          <p>
          Go to the email you registerd with and click the verification link to gain access to see the leaderboard and 
          choose your pickems!
          </p>
        </Alert>
      </div>
    );
  }
}

export default EmailVerificationAlert;