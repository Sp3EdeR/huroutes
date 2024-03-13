(function(){function toast(event)
{event.preventDefault();var toast=$('#toast-pwa-app');toast.toast('show');toast.on('hide.bs.toast',()=>localStorage.shownPwaAd=true);toast.find('a[href]').on('click',()=>{event.prompt();toast.toast('hide');return false;});}
function iosToast()
{}
if(!localStorage.shownPwaAd)
{window.addEventListener("beforeinstallprompt",event=>setTimeout(()=>toast(event),5000));if(navigator.userAgent.match(/iP(ad|od|hone).*Safari/)&&!navigator.standalone&&!window.matchMedia('(display-mode: standalone)').matches)
iosToast();}
if('serviceWorker'in navigator)
navigator.serviceWorker.register('service-worker.js');})();