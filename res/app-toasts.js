$(document).ready(() => {

    // Wait a bit before doing toasts
    setTimeout(function() {
        androidAppToast();
        androidAppUpdateToast();
    }, 5000);

    /** Shows a toast to Android users that don't use the app that it is available. */
    function androidAppToast()
    {
        // Don't show if:
        if (
            // Already shown the ad
            localStorage.shownAndroidAd ||
            // Not running on Android
            !navigator.userAgent.includes('Android') ||
            // Running within the Android application
            navigator.userAgent.includes('huroutes') ||
            // Running within PWA application
            navigator.standalone === true ||
            window.matchMedia('(display-mode: standalone)').matches)
            return;

        var androidToast = $('#toast-android-app');
        androidToast.toast('show');
        // The toast is not shown again once closed.
        androidToast.on('hide.bs.toast', () => localStorage.shownAndroidAd = true);
        androidToast.find('a[href]').on('click', () => androidToast.toast('hide'));
    }

    /** Shows a toast for Android app users when an updated version is available. */
    function androidAppUpdateToast()
    {
        if (!navigator.userAgent.includes('huroutes'))
            return;

        const ghRelease = 'https://api.github.com/repos/Sp3EdeR/huroutes-android/releases/latest';
        $.getJSON(ghRelease, data => {
            try
            {
                const url = data.assets[0].browser_download_url;
                const ver = data.tag_name.slice(1);
                const appVer = navigator.userAgent.match(/\bhuroutes\/(\d+(?:\.\d+)*)\b/)[1];
                if (ver.localeCompare(appVer, undefined, { numeric: true, sensitivity: 'base' }) == 1)
                {
                    var androidToast = $('#toast-app-update');
                    androidToast.find('a[href]').attr('href', url);
                    androidToast.toast('show');
                }
            }
            catch
            {
                console.error('Invalid GitHub release JSON.');
            }
        });
    }

});