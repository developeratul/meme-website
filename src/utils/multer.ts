import multer from "multer";

// I am doing all the validations in the front-end so I am not filtering the files here
export default multer({
  storage: multer.diskStorage({}),
});
