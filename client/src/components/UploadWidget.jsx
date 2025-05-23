import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addImage } from "../features/productSlice";
import { Button } from '@/components/ui/button'
import { uwConfig } from "../utils/cloudinary";


const UploadWidget = () => {

    const uploadWidgetRef = useRef(null);
    const uploadButtonRef = useRef(null);

    const { images } = useSelector((state) => state.product)

    const dispatch = useDispatch()

    useEffect(() => {
        const initializeUploadWidget = () => {
            if (window.cloudinary && uploadButtonRef.current) {
                // Create upload widget
                uploadWidgetRef.current = window.cloudinary.createUploadWidget(
                    uwConfig,
                    (error, result) => {
                        if (!error && result && result.event === 'success') {
                            //   setTemp((prev) => ({
                            //     ...prev,
                            //     images: [...prev.images, result.info.url], // Append new image URL
                            //   }));

                            dispatch(addImage(result.info.url))
                        }
                    }
                );

                // Add click event to open widget
                const handleUploadClick = () => {
                    if (uploadWidgetRef.current) {
                        uploadWidgetRef.current.open();
                    }
                };

                const buttonElement = uploadButtonRef.current;
                buttonElement.addEventListener('click', handleUploadClick);

                // Cleanup
                return () => {
                    buttonElement.removeEventListener('click', handleUploadClick);
                };
            }
        };

        initializeUploadWidget();
        console.log(images)
    }, [uwConfig, images])



    return (
        <Button
            ref={uploadButtonRef}
            id="upload_widget"
        >
            Upload
        </Button>
    );

}

export default UploadWidget