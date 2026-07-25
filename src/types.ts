export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileItem[];
};
