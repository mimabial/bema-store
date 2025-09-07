import {CodeXml} from "@/components/icons";

export function Footer() {
  return (
    <footer className="px-4 py-6">
      <div className="container flex items-center p-0">
        <CodeXml className="mr-2 h-6 w-6"/>
        <p className="text-sm">
          Built by{" "}
          <a className="underline underline-offset-4" >
            Milord.NET
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
