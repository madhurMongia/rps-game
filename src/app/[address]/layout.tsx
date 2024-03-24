import '../globals.css';
import { LoaderProvider } from "@/contexts/loader";

export const metadata = {
  title: "Battle Field",
  description: "RPS Session",
};

export default function RootLayout({
  children
} :Readonly<{
    children: React.ReactNode
  }>){
  return (
    <html lang="en">
      <body>
        <LoaderProvider>{children}</LoaderProvider>
      </body>
    </html>
  );
}
