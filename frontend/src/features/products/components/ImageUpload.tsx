import { FileInput, Label } from 'flowbite-react';

interface ImageUploadProps {
  setFiles: (files: FileList | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setFiles }) => {
  return (
    <div className="w-full mb-5" id="fileUpload">
      <div className="mb-2 block">
        <Label htmlFor="file" value="Upload product image" />
      </div>
      <FileInput id="file" onChange={(e) => setFiles(e.target.files)} />
    </div>
  );
};

export default ImageUpload;
