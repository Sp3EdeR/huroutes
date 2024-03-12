(function(){function toast(event)
{event.preventDefault();var toast=$('#toast-pwa-app');toast.toast('show');toast.on('hide.bs.toast',()=>localStorage.shownPwaAd=true);toast.find('a[href]').on('click',async()=>{const ret=await event.prompt();if(ret=="accepted")
toast.toast('hide');});}
if(!localStorage.shownPwaAd)
window.addEventListener("beforeinstallprompt",event=>setTimeout(()=>toast(event),5000));if('serviceWorker'in navigator)
navigator.serviceWorker.register('service-worker.js');})();