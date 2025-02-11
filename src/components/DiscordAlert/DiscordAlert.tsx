// import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

type DiscordAlertProp = {
  discordId: string | null;
};

function DiscordAlert({ discordId }: DiscordAlertProp) {

  if (discordId !== null || discordId !== "") {
    return (
      <>
        <Alert variant = "primary" dismissible>
          <Alert.Heading>You haven't linked your Discord Account!</Alert.Heading>
          <p>
          Add your Discord account in the User's page to be eligible for prizes from the pickems!
          Note: If you do win a prize you will be messaged through the Discord username you entered.
          </p>
        </Alert>
      </>
    );
  }
}

export default DiscordAlert;