import { redirect } from "next/navigation";

// Photos now live on the merged Shelf page (Music + Photos).
export default function PhotosPage() {
  redirect("/multimodal-shelf");
}
