import { Platform } from 'react-native';

const uploadImage = async (uri) => {
  // Extract the filename from the URI
  const filename = uri.substring(uri.lastIndexOf('/') + 1);

  // For Android, remove the 'file://' prefix, but for iOS, retain it
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

  // Log the URI to check if it's correct
  console.log('Uploading image with URI:', uploadUri);

  const formData = new FormData();
  formData.append('file', {
    uri: uploadUri,
    type: 'image/jpeg', // Ensure that the image type is correct
    name: filename,
  });
  formData.append('upload_preset', 'fmn7iwjl');
  formData.append('cloud_name', 'dh71lmbge');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dh71lmbge/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();

    if (data.secure_url) {
      console.log('Image uploaded successfully:', data.secure_url);
      return data.secure_url;
    } else {
      throw new Error('Image URL not returned');
    }
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

export default uploadImage;
