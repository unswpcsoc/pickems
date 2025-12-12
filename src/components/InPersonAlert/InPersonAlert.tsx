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
          <Alert.Heading>You haven't added your attendance status for Friday!</Alert.Heading>
          <p>
          Add your Oceanic Prodigies in person attendance in the User's page to be eligible for prizes from the pickems!
          Note: If you are not attending in person on Friday the 11th of July you will not be eligible for any pickems prizes!
          </p>
        </Alert>
      </>
    );
  }
}

export default InPersonAlert;