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
            Check the inbox of the email you registered with and click the verification link to gain access to the leaderboard and pickems!
            Note: It may take a few minutes for the verification email to be sent. 
          </p>
        </Alert>
      </div>
    );
  }
}

export default EmailVerificationAlert;