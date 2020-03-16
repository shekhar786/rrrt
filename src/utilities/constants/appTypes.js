const appTypes = {
    yabalash: {
        id: 0,
        name: 'Yabalash',
        appLink: 'https://play.google.com/store/apps',
        firebaseDomainPrefix: 'https://yabalash.page.link',
        bundleId: 'com.baseProject.yabalash',
        channelId: 'Yabalash',
        channelName: 'Yabalash',
        channelDiscription: 'Yabalash push channel.',
    },
    shilengae: {
        id: 1,
        name: 'Shilengae',
        appLink: 'https://play.google.com/store/apps',
        firebaseDomainPrefix: 'https://shilengae.page.link',
        bundleId: 'com.baseProject.shilengae',
        channelId: 'Shilengae',
        channelName: 'Shilengae',
        channelDiscription: 'Shilengae push channel.',
    },
    beault: {
        id: 2,
        name: 'beault',
        appLink: 'https://play.google.com/store/apps',
        firebaseDomainPrefix: 'https://beault.page.link',
        bundleId: 'com.baseProject.beault',
        channelId: 'beault',
        channelName: 'beault',
        channelDiscription: 'beault push channel.',
    }
};

const initialAppState = {
    appId: appTypes.shilengae.id,
    // appId: appTypes.yabalash.id,
    // appId: appTypes.beault.id,
};

const getAppdata = (appId = initialAppState.appId) => {
    let appData = {
        id: null,
        name: '',
        appLink: '',
        firebaseDomainPrefix: '',
        channelId: '',
        channelName: '',
        channelDiscription: ''
    };

    Object.keys(appTypes).forEach((app) => {
        if (appTypes[app].id === appId) {
            appData = appTypes[app];
        }
    });

    return appData;
};

export {
    appTypes,
    getAppdata,
    initialAppState
};
