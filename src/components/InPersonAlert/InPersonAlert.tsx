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
          <Alert.Heading>Add In-person attendance status for Oceanic Prodigies!</Alert.Heading>
          <p>
          Add your Oceanic Prodigies in-person attendance on the User's page to be eligible for Pickems prizes.
          Note: If you are not attending in person on the 10th of March you will be ineligible for Pickems prizes.
          </p>
        </Alert>
      </>
    );
  }
}

export default InPersonAlert;