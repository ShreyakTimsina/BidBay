// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// exports.uploadFile = async (file) => {
//   try {
//     const uploadOptions = {
//       folder: 'uploads',
//       public_id: file.filename,
//       resource_type: 'auto'
//     };
//     const result = await cloudinary.uploader.upload(file.path, uploadOptions);
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to upload file to Cloudinary');
//   }
// };
// exports.uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'upload/image',
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );

//     const readStream = fs.createReadStream(file.path);
//     readStream.pipe(uploadStream);
//   });
// };
// exports.getFileStream = async (public_id) => {
//   const result = await cloudinary.image(public_id, {
//     format: 'jpg',
//     crop: 'fill',
//     width: 400,
//     height: 400,
//   });
//   return result;
// };

const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const fs = require("fs");
const unlinkFile = promisify(fs.unlink);

// Upload file to Cloudinary
exports.uploadFile = (file) => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: "uploads" },
			(error, result) => {
				if (result) {
					console.log(result);
					resolve(result);
				} else {
					reject(error);
				}
			}
		);
		fs.createReadStream(file.path).pipe(stream);
	});
};

// Get file from Cloudinary
exports.getFileStream = async (fileKey) => {
	const result = await cloudinary.api.resource(fileKey);
	const stream = cloudinary.api.resource_stream(fileKey);
	return stream;
};
