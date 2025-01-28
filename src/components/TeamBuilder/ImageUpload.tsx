// ImageUpload Component
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

type ImageUploadProps = {
  // callbacks to notify TeamBuilder of the upload status/url
  onFileUpload: (uploaded: boolean) => void; 
  onTeamLogo: (url: string) => void; 
};

const ImageUpload = ({ onFileUpload, onTeamLogo }: ImageUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>("");

  const storage = getStorage();

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(false); // Reset the upload status when a new file is selected
    }
  };

  // Upload file to Firebase Storage
  const handleUpload = () => {
    if (!file) return;

    const fileRef = ref(storage, `uploads/${file.name}`);
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
          onTeamLogo(downloadURL);
          setProgress(100); // Ensure progress is complete
          onFileUpload(true); // Notify that the file has been uploaded successfully
        });
      }
    );
  };

  return (
    <div className="file-upload">
      <h4>Upload team logo</h4>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div>
          <p>File size: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
      <button type="button" onClick={handleUpload} disabled={!file}>
        Upload
      </button>
      {progress > 0 && progress < 100 && (
        <div>Uploading: {Math.round(progress)}%</div>
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
