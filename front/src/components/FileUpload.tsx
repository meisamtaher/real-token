import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

const ImageUploadToIPFS = () => {
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e?.target?.files)
        setFile(e?.target?.files[0]);
  };

  const uploadToIPFS = async () => {
    if (file === null) return alert('No file selected.');
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const pinataMetadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);
    try {
      console.log("Uploading file on IPFS... ");
      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data;`,
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        }
      });
      console.log("response: ",response);
      const ipfsUri = `https://green-enthusiastic-mite-198.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
      setUrl(ipfsUri);
      console.log('IPFS URL:', ipfsUri);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <input disabled = {loading} type="file" onChange={onFileChange} accept="image/*" />
      <button disabled = {loading} onClick={uploadToIPFS}>Upload to IPFS</button>
      {loading && <Typography>Uploading file ...</Typography>}
      {url && <div><a href={url} target="_blank" rel="noopener noreferrer">View uploaded image</a></div>}
      {url && <img  src={url} width={200} height={275}/>}
    </div>
  );
};

export default ImageUploadToIPFS;