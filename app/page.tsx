import paths from "@/utils/paths";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(paths.schoolAll());
}
