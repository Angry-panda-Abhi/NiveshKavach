import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6 border-t-[4px] border-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <span className="font-bold text-2xl tracking-tight">NiveshKavach</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4 max-w-md">
              Protecting Indian investors from financial scams with AI-powered analysis. A project built for the SANGYAN hackathon, IIT BHU.
            </p>
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-primary border border-primary/30">
              SANGYAN Hackathon Project
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/check" className="hover:text-primary transition-colors">Check a Message</Link></li>
              <li><Link href="/verify" className="hover:text-primary transition-colors">Verify SEBI Advisor</Link></li>
              <li><Link href="/grievance" className="hover:text-primary transition-colors">File a Grievance</Link></li>
              <li><Link href="/learn" className="hover:text-primary transition-colors">Learn About Scams</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Official Portals</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="https://www.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">SEBI Official <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></li>
              <li><a href="https://scores.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">SCORES Portal <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></li>
              <li><a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">Cybercrime Portal <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} NiveshKavach. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium text-red-400 bg-red-400/10 px-3 py-1 rounded-md border border-red-400/20">
            Disclaimer: NiveshKavach does not provide financial advice. Always verify with registered professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
