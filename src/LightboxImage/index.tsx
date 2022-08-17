import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

type TLightboxImage = {
	src: {
		url: string;
		title: string;
	} | null;
	setSrc: (value: null) => void;
};
export default React.memo(({ src, setSrc }: TLightboxImage) => {
	if (!src) return null;

	return (
		<Lightbox
			animationOnKeyInput
			mainSrc={src.url}
			onCloseRequest={() => {
				setSrc(null);
			}}
			imageTitle={src.title}
			imagePadding={100}
			onMovePrevRequest={() => {}}
			onMoveNextRequest={() => {}}
		/>
	);
});
