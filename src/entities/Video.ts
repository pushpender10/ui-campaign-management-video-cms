"use server";

import path from "path";
import fs from "fs";

export const Video = {
  create: async (userId: string, formData: object) => {
    console.log(userId, formData);
  },
  uploadfile: async (file: File) => {
    // console.log(userId, file);
    const UPLOAD_DIR = path.resolve(
      process.env.UPLOAD_DIR ?? "",
      "/storage/uploads/"
    );

    // export const POST = async (req: NextRequest) => {
    //   const formData = await req.formData();
    //   const body = Object.fromEntries(formData);
    //   const file = (body.file as Blob) || null;
    let newFileName: string = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const mimeType = file.type; // e.g., 'video/mp4'
      const fileExtension = mimeType.split("/")[1]; // Extract 'mp4' from 'video/mp4'
      const timestamp = Date.now();
      const sanitizedFileName = file.name
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9._-]/g, ""); // Remove special characters

      newFileName = `${path
        .basename(sanitizedFileName, path.extname(sanitizedFileName))
        .slice(0, 50)}_${timestamp}.${fileExtension}`;

      // Ensure the upload directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      fs.writeFileSync(path.resolve(UPLOAD_DIR, newFileName), buffer);
    } else {
      return {
        success: false,
      };
    }

    // return NextResponse.json({
    //   success: true,
    //   name: (body.file as File).name,
    // });
    return { success: true, fileName: newFileName };
  },
};
