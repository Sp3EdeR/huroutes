(function(){if(navigator.userAgent.match(/(Windows|Macintosh|X11).*(Opera|OPR)/))
return;function toast(id)
{var toast=$(id);toast.toast('show');toast.on('hide.bs.toast',()=>localStorage.shownPwaAd=true);return toast;}
function pwaToast(event)
{event.preventDefault();var toast=toast('#toast-pwa-app');toast.find('a[href]').on('click',()=>{event.prompt();toast.toast('hide');return false;});}
if(!localStorage.shownPwaAd)
{window.addEventListener("beforeinstallprompt",event=>setTimeout(()=>pwaToast(event),5000));if(navigator.userAgent.match(/iP(ad|od|hone).*Safari/)&&!navigator.standalone&&!window.matchMedia('(display-mode: standalone)').matches)
toast('#toast-safari-app');}
if('serviceWorker'in navigator)
navigator.serviceWorker.register('sw.js');})();