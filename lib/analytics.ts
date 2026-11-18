/**
 * Google Analytics 4, loaded without a dependency or a cookie banner library.
 *
 * The measurement ID is public by design (it ships to every visitor's browser), so
 * it is not a secret. The script only runs on the real domain, so local runs and
 * preview deployments never count as visits, and it stays off for anyone whose
 * browser sends Do Not Track or Global Privacy Control. Two events are sent in
 * addition to page views: an email click and a résumé download.
 */
export const GA_MEASUREMENT_ID = "G-LLJC91N9QP";

export const GA_HOSTS = [
  "aadhithyavijayakumar.com",
  "www.aadhithyavijayakumar.com",
] as const;

/** The inline script, as a string, built so the guards are visible and testable. */
export function analyticsSnippet(id: string, hosts: readonly string[]): string {
  return `(function(){
var hosts=${JSON.stringify(hosts)};
if(hosts.indexOf(location.hostname)===-1)return;
if(navigator.doNotTrack==="1"||navigator.globalPrivacyControl)return;
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=gtag;
gtag("js",new Date());
gtag("config",${JSON.stringify(id)});
var s=document.createElement("script");
s.async=true;
s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(${JSON.stringify(id)});
document.head.appendChild(s);
document.addEventListener("click",function(e){
var a=e.target&&e.target.closest?e.target.closest("a"):null;
if(!a)return;
var h=a.getAttribute("href")||"";
if(h.indexOf("mailto:")===0){gtag("event","email_click");}
else if(a.hasAttribute("download")||/\\.pdf($|\\?)/i.test(h)){gtag("event","resume_download");}
},true);
})();`;
}
