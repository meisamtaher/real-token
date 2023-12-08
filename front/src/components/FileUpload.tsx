import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';

const ImageUploadToIPFS = () => {
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState('');

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files)
        setFile(e?.target?.files[0]);
  };

  const uploadToIPFS = async () => {
    if (file === null) return alert('No file selected.');

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('https://ipfs.infura.io:5001/api/v0/add', formData, {
        headers: {
          // You can add authorization headers if required by the service
          "Content-Type": "multipart/form-data",
        },
      });

      const ipfsUri = `https://ipfs.infura.io/ipfs/${response.data.Hash}`;
      setUrl(ipfsUri);
      console.log('IPFS URL:', ipfsUri);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} accept="image/*" />
      <button onClick={uploadToIPFS}>Upload to IPFS</button>
      {url && <div><a href={url} target="_blank" rel="noopener noreferrer">View uploaded image</a></div>}
    </div>
  );
};

export default ImageUploadToIPFS;