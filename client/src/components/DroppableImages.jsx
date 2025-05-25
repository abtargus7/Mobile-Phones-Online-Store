import { DndProvider, useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import {HTML5Backend} from 'react-dnd-html5-backend'
import { removeImage } from "../features/productSlice";

const ItemType = "IMAGE";

const DroppableImage = ({ image, index, deleteImage }) => {

  return (
    <div
      className={`relative w-32 h-32 m-2 overflow-hidden rounded border border-gray-300
      }`}
    >
      <img src={image} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
      <button
        onClick={() => deleteImage(image)}
        className="absolute top-0 right-0 bg-red text-white rounded-full text-xs p-1"
      >
        X
      </button>
    </div>
  );
};

const DroppableRecievedImage = ({ image, index, deleteImage }) => {

  return (
    <div
      className={`relative w-32 h-32 m-2 overflow-hidden rounded border border-gray-300
      }`}
    >
      <img src={image.image} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
      <button
        onClick={() => deleteImage(image)}
        className="absolute top-0 right-0 bg-red-400 text-white rounded-full text-xs p-1"
      >
        X
      </button>
    </div>
  );
};

const ImageDisplayManager = () => {

  const {images, existingImages} = useSelector((state) => state.product)
  const dispatch = useDispatch()

  const deleteImage = (image) => {
      dispatch(removeImage(image))
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-wrap transition-all duration-300 rounded border border-dashed border-gray-300 p-2">
        {existingImages && existingImages.map((image, index) => (
          <DroppableRecievedImage key={index} index={index} image={image} deleteImage={deleteImage} />
        ))}
        
        {images && images.map((image, index) => (
          <DroppableImage key={index} index={index} image={image} deleteImage={deleteImage} />
        ))}
      </div>
    </DndProvider>
  );
};

export default ImageDisplayManager;
