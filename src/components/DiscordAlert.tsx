import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function DiscordAlert() {
const [show, setShow] = useState(false);

  if (show) {
    return (
      <>
        <Alert variant = "primary" dismissible>
          <Alert.Heading>You haven't linked your Discord Account!</Alert.Heading>
          <p>
          Add your Discord account in the User's page to be eligible for prizes from this site!
          Note: If you do win a prize you will be messaged through the Discord username you entered.
          </p>
        </Alert>
      </>
    );
  }
}

export default DiscordAlert;