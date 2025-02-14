// import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

type InPersonAlertProp = {
  attendanceStatus: boolean | null | undefined;
};

function InPersonAlert({ attendanceStatus }: InPersonAlertProp) {
  if (attendanceStatus === null || attendanceStatus === undefined) {
    return (
      <>
        <Alert variant = "primary" dismissible>
          <Alert.Heading>You haven't added your attendance status for Sunday!</Alert.Heading>
          <p>
          Add your Megalan in person attendance in the User's page to be eligible for prizes from the pickems!
          Note: If you are not attending in person on Sunday you will only be eligible for the online pickems prize pool (Only the 1st place Aorus Jacket).
          The other prizes are only eligible for in person attendees attending Megalan on Sunday.
          </p>
        </Alert>
      </>
    );
  }
}

export default InPersonAlert;