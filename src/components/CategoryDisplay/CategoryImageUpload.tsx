import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata } from 'firebase/storage';
import Button from 'react-bootstrap/Button';

type ImageUploadProps = {
  // callbacks to notify TeamBuilder of the upload status/url
  onFileUpload: (uploaded: boolean) => void; 
  setLogoUrl: (url: string) => void; 
  categoryName: string;
};

const ImageUpload = ({ onFileUpload, setLogoUrl, categoryName }: ImageUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("")

  const storage = getStorage();

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(false); // Reset the upload status when a new file is selected
    }
  };

  // Check if file already exists in Firebase Storage
  const checkIfFileExists = async (fileRef: any) => {
    try {
      await getMetadata(fileRef);  // Attempt to get the file's metadata
      return true; // File exists
    } catch (error) {
      return false; // File does not exist
    }
  };

  // Upload file to Firebase Storage
  const handleUpload = async () => {
    if (!file) return;

    const fileRef = ref(storage, `uploads/category/${categoryName}/${file.name}`);

    // First check if the file already exists
    const fileExists = await checkIfFileExists(fileRef);
    if (fileExists) {
      setErrorMessage('This file already exists! Please either rename it or contact tech support!\n Hint: This is due to the fact a file with the same name exists in the storage system.');
      return; // Stop the upload if the file exists
    }

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get the progress of the upload
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      () => {
        // Get the download URL after the upload is completed
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setLogoUrl(downloadURL);
          setProgress(100); // Ensure progress is complete
          onFileUpload(true); // Notify that the file has been uploaded successfully
        });
      }
    );
  };

  return (
    <div className="file-upload">
      <h4>Upload Item logo</h4>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div>
          <p>File size: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
      <Button type="button" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
      {progress > 0 && progress < 100 && (
        <div>Uploading: {Math.round(progress)}%</div>
      )}
      {errorMessage !== "" && (
        <p>{errorMessage}</p>
      )}
      {url && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
