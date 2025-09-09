import path from "path";
import * as fs from "fs";
import sharp from "sharp";

const generateBlurDataURL = async (filePath: string): Promise<string> => {
  let base64String = "";
  try {
    const absolutePath = `${path.resolve()}/public/${filePath}`;
    console.log("Resolved absolute path:", absolutePath);

    const imageBuffer: Buffer = fs.readFileSync(absolutePath);
    // console.log("Image buffered successfully from file:", imageBuffer);
    const tinyImageBuffer = await sharp(imageBuffer)
      .resize({ width: 10 }) // Resize to 10 pixel width
      //   .grayscale() // Convert to grayscale
      .jpeg({ quality: 10 }) // Export as low-quality JPEG
      .toBuffer();

    base64String = tinyImageBuffer.toString("base64");
    // return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error("Error reading image file:", error);
  }

  return `data:image/jpeg;base64,${base64String}`;
};

export default generateBlurDataURL;
